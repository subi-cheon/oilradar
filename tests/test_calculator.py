"""최저가 계산 로직 테스트 (네트워크 없음)."""

from backend.calculator import cheapest_by_fuel, cheapest_for_fuel
from backend.models import Station


def _station(uni_id: str, price: int, distance_m: float, fuel: str = "gasoline") -> Station:
    return Station(
        uni_id=uni_id,
        name=f"주유소{uni_id}",
        brand_code="GSC",
        brand_name="GS칼텍스",
        fuel=fuel,
        price=price,
        lat=36.35,
        lng=127.38,
        distance_m=distance_m,
    )


def test_picks_lowest_price():
    stations = [
        _station("a", 1650, 1000),
        _station("b", 1623, 3000),
        _station("c", 1641, 500),
    ]
    result = cheapest_for_fuel(stations, "gasoline")
    assert result.cheapest.uni_id == "b"
    assert [s.uni_id for s in result.candidates] == ["b", "c", "a"]


def test_tie_break_by_distance():
    """같은 가격이면 더 가까운 곳을 우선."""
    stations = [
        _station("far", 1623, 5000),
        _station("near", 1623, 800),
    ]
    result = cheapest_for_fuel(stations, "gasoline")
    assert result.cheapest.uni_id == "near"


def test_empty_returns_none():
    result = cheapest_for_fuel([], "gasoline")
    assert result.cheapest is None
    assert result.candidates == []


def test_filters_by_fuel():
    stations = [
        _station("g", 1623, 1000, fuel="gasoline"),
        _station("d", 1400, 1000, fuel="diesel"),
    ]
    result = cheapest_for_fuel(stations, "diesel")
    assert result.cheapest.uni_id == "d"


def test_cheapest_by_fuel_multi():
    results = cheapest_by_fuel(
        {
            "gasoline": [_station("g", 1623, 1000, fuel="gasoline")],
            "diesel": [],
        }
    )
    by_fuel = {r.fuel: r for r in results}
    assert by_fuel["gasoline"].cheapest.uni_id == "g"
    assert by_fuel["diesel"].cheapest is None
