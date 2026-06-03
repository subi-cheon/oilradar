"""좌표 변환/거리 계산 테스트."""

import math

from backend import geo


def test_katec_roundtrip():
    """WGS84 → KATEC → WGS84 왕복 시 원좌표 복원(오차 < 1m 수준)."""
    lat, lng = 36.3504, 127.3845  # 대전 둔산동
    x, y = geo.wgs84_to_katec(lat, lng)
    lat2, lng2 = geo.katec_to_wgs84(x, y)
    assert abs(lat - lat2) < 1e-5
    assert abs(lng - lng2) < 1e-5


def test_katec_in_expected_range():
    """대전권 KATEC 좌표는 대략 34만대(x), 41만대(y) 범위."""
    x, y = geo.wgs84_to_katec(36.3504, 127.3845)
    assert 340_000 < x < 350_000
    assert 410_000 < y < 420_000


def test_haversine_known_distance():
    """위도 1도 ≈ 111km 근방."""
    d = geo.haversine_m(36.0, 127.0, 37.0, 127.0)
    assert math.isclose(d, 111_195, rel_tol=0.01)


def test_haversine_zero():
    assert geo.haversine_m(36.35, 127.38, 36.35, 127.38) == 0.0


def test_offset_latlng_distance():
    """북쪽으로 1000m 이동한 좌표는 기준점과 약 1000m 떨어져 있어야."""
    lat, lng = 36.35, 127.38
    nlat, nlng = geo.offset_latlng(lat, lng, 1000, 0)
    assert math.isclose(geo.haversine_m(lat, lng, nlat, nlng), 1000, rel_tol=0.01)
