"""오피넷 응답 파싱 + 클라이언트 테스트 (네트워크 목)."""

import json
from pathlib import Path

import httpx

from backend.opinet import OpinetClient, parse_around_all

FIXTURE = Path(__file__).parent / "fixtures" / "aroundall_sample.json"


def _payload() -> dict:
    return json.loads(FIXTURE.read_text(encoding="utf-8"))


def test_parse_basic_fields():
    center_lat, center_lng = 36.3504, 127.3845
    stations = parse_around_all(_payload(), "gasoline", center_lat, center_lng)
    assert len(stations) == 3
    s = stations[0]
    assert s.uni_id == "A0010001"
    assert s.name == "GS칼텍스 둔산점"
    assert s.brand_name == "GS칼텍스"
    assert s.price == 1623
    assert s.fuel == "gasoline"
    # KATEC → WGS84 변환으로 대전권 위경도가 나와야
    assert 36.0 < s.lat < 37.0
    assert 127.0 < s.lng < 128.0
    assert s.distance_m >= 0


def test_parse_skips_malformed_rows():
    payload = {"RESULT": {"OIL": [{"UNI_ID": "x", "OS_NM": "no price"}]}}
    assert parse_around_all(payload, "gasoline", 36.35, 127.38) == []


def test_parse_empty_result():
    assert parse_around_all({}, "gasoline", 36.35, 127.38) == []


def test_find_around_dedupes_and_sorts():
    """그리드 분할로 같은 UNI_ID 가 여러 번 와도 1개로 병합, 가격 오름차순."""

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=_payload())

    transport = httpx.MockTransport(handler)
    client = OpinetClient("DUMMY", client=httpx.Client(transport=transport))
    try:
        stations = client.find_around(36.3504, 127.3845, "gasoline", radius_m=10_000)
    finally:
        client.close()

    # UNI_ID 3종 → 중복 제거 후 3곳
    assert len({s.uni_id for s in stations}) == len(stations) == 3
    # 가격 오름차순 (동점은 거리순)
    prices = [s.price for s in stations]
    assert prices == sorted(prices)
