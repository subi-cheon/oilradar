"""최저가 계산 로직.

주유소 목록에서 유종별 최저가 1곳을 산출한다.
동점(같은 가격) 시 거리가 가까운 곳을 우선한다.
"""

from __future__ import annotations

from .models import CheapestResult, Station


def cheapest_for_fuel(stations: list[Station], fuel: str) -> CheapestResult:
    """단일 유종의 최저가 결과 산출."""
    candidates = sorted(
        (s for s in stations if s.fuel == fuel),
        key=lambda s: (s.price, s.distance_m),
    )
    return CheapestResult(
        fuel=fuel,
        cheapest=candidates[0] if candidates else None,
        candidates=candidates,
    )


def cheapest_by_fuel(
    stations_by_fuel: dict[str, list[Station]],
) -> list[CheapestResult]:
    """유종별 주유소 목록 dict → 유종별 최저가 결과 리스트."""
    return [
        cheapest_for_fuel(stations, fuel)
        for fuel, stations in stations_by_fuel.items()
    ]
