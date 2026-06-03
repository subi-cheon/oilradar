"""좌표 변환 및 거리 계산.

오피넷 `aroundAll.do` 는 WGS84(위경도)가 아니라 **KATEC** 좌표를 요구한다.
카카오 지오코딩/브라우저 GPS 가 주는 위경도를 KATEC 으로 변환해야 한다.
"""

from __future__ import annotations

import math
from functools import lru_cache

from pyproj import Transformer

# 오피넷이 사용하는 KATEC 좌표계 정의 (Bessel 타원체 기반 TM).
KATEC_PROJ4 = (
    "+proj=tmerc +lat_0=38 +lon_0=128 +ellps=bessel "
    "+k=0.9999 +x_0=400000 +y_0=600000 "
    "+towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43 "
    "+units=m +no_defs"
)

EARTH_RADIUS_M = 6_371_000.0


@lru_cache(maxsize=2)
def _transformer(reverse: bool = False) -> Transformer:
    if reverse:
        return Transformer.from_crs(KATEC_PROJ4, "EPSG:4326", always_xy=True)
    return Transformer.from_crs("EPSG:4326", KATEC_PROJ4, always_xy=True)


def wgs84_to_katec(lat: float, lng: float) -> tuple[float, float]:
    """위경도(WGS84) → KATEC (x, y) 미터 좌표."""
    x, y = _transformer(reverse=False).transform(lng, lat)
    return x, y


def katec_to_wgs84(x: float, y: float) -> tuple[float, float]:
    """KATEC (x, y) → 위경도(WGS84) (lat, lng)."""
    lng, lat = _transformer(reverse=True).transform(x, y)
    return lat, lng


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """두 위경도 사이의 대권 거리(미터)."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    )
    return 2 * EARTH_RADIUS_M * math.asin(math.sqrt(a))


def offset_latlng(lat: float, lng: float, d_north_m: float, d_east_m: float) -> tuple[float, float]:
    """기준 좌표에서 북/동 방향으로 d미터 떨어진 위경도 반환 (근사)."""
    dlat = d_north_m / EARTH_RADIUS_M
    dlng = d_east_m / (EARTH_RADIUS_M * math.cos(math.radians(lat)))
    return lat + math.degrees(dlat), lng + math.degrees(dlng)
