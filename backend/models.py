"""도메인 데이터 모델."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Station:
    """주유소 1곳 + 특정 유종 가격."""

    uni_id: str          # 오피넷 고유 ID (UNI_ID)
    name: str            # 주유소명 (OS_NM)
    brand_code: str      # 브랜드 코드 (POLL_DIV_CD)
    brand_name: str      # 브랜드 한글명
    fuel: str            # 내부 유종 키 (gasoline/diesel/lpg)
    price: int           # 리터당 가격 (원)
    lat: float           # 위도 (WGS84)
    lng: float           # 경도 (WGS84)
    distance_m: float    # 기준 좌표로부터 거리(미터)


@dataclass(frozen=True)
class CheapestResult:
    """특정 유종의 최저가 주유소 + 후보 목록."""

    fuel: str
    cheapest: Station | None
    candidates: list[Station]  # 가격 오름차순 정렬된 전체 후보
