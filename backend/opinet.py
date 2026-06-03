"""오피넷(한국석유공사) API 클라이언트.

`aroundAll.do` — 기준 좌표 반경 내 주유소 + 지정 유종 가격 목록을 반환한다.
- 입력 좌표는 KATEC, radius 는 미터(최대 5000).
- 10km 반경은 5km 한도를 넘으므로, 중심 + 4방향 오프셋 좌표로 분할 호출 후
  UNI_ID 기준 중복 제거하여 병합한다(그리드 분할).
"""

from __future__ import annotations

import httpx

from . import geo
from .config import (
    BRAND_NAMES,
    OPINET_MAX_RADIUS_M,
    PROD_CODES,
)
from .models import Station

AROUND_ALL_URL = "https://www.opinet.co.kr/api/aroundAll.do"


def parse_around_all(
    payload: dict,
    fuel: str,
    center_lat: float,
    center_lng: float,
) -> list[Station]:
    """`aroundAll.do` JSON 응답 → Station 리스트.

    거리는 응답의 DISTANCE 대신, 주유소 KATEC 좌표를 위경도로 환산해
    실제 기준 좌표 기준 하버사인 거리로 재계산한다(그리드 병합 시 일관성).
    """
    oils = (payload or {}).get("RESULT", {}).get("OIL", []) or []
    stations: list[Station] = []
    for o in oils:
        try:
            x = float(o["GIS_X_COOR"])
            y = float(o["GIS_Y_COOR"])
            lat, lng = geo.katec_to_wgs84(x, y)
            price = int(round(float(o["PRICE"])))
        except (KeyError, ValueError, TypeError):
            continue
        brand_code = str(o.get("POLL_DIV_CD", "")).strip()
        stations.append(
            Station(
                uni_id=str(o.get("UNI_ID", "")).strip(),
                name=str(o.get("OS_NM", "")).strip(),
                brand_code=brand_code,
                brand_name=BRAND_NAMES.get(brand_code, brand_code or "기타"),
                fuel=fuel,
                price=price,
                lat=lat,
                lng=lng,
                distance_m=geo.haversine_m(center_lat, center_lng, lat, lng),
            )
        )
    return stations


def _grid_points(lat: float, lng: float, radius_m: int) -> list[tuple[float, float]]:
    """반경이 5km 초과면 중심 + 4방향 오프셋 좌표를 반환(그리드 분할)."""
    if radius_m <= OPINET_MAX_RADIUS_M:
        return [(lat, lng)]
    # 중심 + 동/서/남/북으로 (radius - 5km) 만큼 떨어진 점에서 각각 5km 조회
    off = radius_m - OPINET_MAX_RADIUS_M
    return [
        (lat, lng),
        geo.offset_latlng(lat, lng, off, 0),
        geo.offset_latlng(lat, lng, -off, 0),
        geo.offset_latlng(lat, lng, 0, off),
        geo.offset_latlng(lat, lng, 0, -off),
    ]


class OpinetClient:
    """오피넷 API 클라이언트."""

    def __init__(self, api_key: str, client: httpx.Client | None = None) -> None:
        self._api_key = api_key
        self._client = client or httpx.Client(timeout=10.0)

    def _fetch(self, katec_x: float, katec_y: float, prodcd: str, radius_m: int) -> dict:
        resp = self._client.get(
            AROUND_ALL_URL,
            params={
                "code": self._api_key,
                "x": f"{katec_x:.1f}",
                "y": f"{katec_y:.1f}",
                "radius": min(radius_m, OPINET_MAX_RADIUS_M),
                "prodcd": prodcd,
                "sort": 1,  # 가격 오름차순
                "out": "json",
            },
        )
        resp.raise_for_status()
        return resp.json()

    def find_around(
        self,
        lat: float,
        lng: float,
        fuel: str,
        radius_m: int,
    ) -> list[Station]:
        """기준 위경도 반경 내 해당 유종 주유소 목록(중복 제거, 가격 오름차순)."""
        if fuel not in PROD_CODES:
            raise ValueError(f"지원하지 않는 유종: {fuel}")
        prodcd = PROD_CODES[fuel]

        merged: dict[str, Station] = {}
        for plat, plng in _grid_points(lat, lng, radius_m):
            kx, ky = geo.wgs84_to_katec(plat, plng)
            payload = self._fetch(kx, ky, prodcd, radius_m)
            for st in parse_around_all(payload, fuel, lat, lng):
                # 실제 반경 내, UNI_ID 중복 제거(더 가까운 거리 우선)
                if st.distance_m > radius_m:
                    continue
                cur = merged.get(st.uni_id)
                if cur is None or st.distance_m < cur.distance_m:
                    merged[st.uni_id] = st

        return sorted(merged.values(), key=lambda s: (s.price, s.distance_m))

    def close(self) -> None:
        self._client.close()
