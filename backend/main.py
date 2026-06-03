"""1단계 콘솔 데모 진입점.

기준 좌표(인자 또는 .env 기본값)로 오피넷을 조회해 유종별 최저가를
콘솔에 출력한다. 프론트엔드/챗봇 이전에 핵심 로직을 검증하는 용도.

실행:
    python -m backend.main                 # .env DEFAULT_LAT/LNG 사용
    python -m backend.main 36.3504 127.3845  # 위도 경도 직접 지정
    python -m backend.main 36.35 127.38 5000 # + 반경(m) 지정
"""

from __future__ import annotations

import sys

from rich.console import Console
from rich.table import Table

from . import naver_link
from .calculator import cheapest_for_fuel
from .config import DEFAULT_RADIUS_M, FUEL_LABELS, PROD_CODES, get_settings
from .opinet import OpinetClient

console = Console()


def _parse_args(argv: list[str], settings) -> tuple[float, float, int]:
    lat = float(argv[0]) if len(argv) >= 1 else settings.default_lat
    lng = float(argv[1]) if len(argv) >= 2 else settings.default_lng
    radius = int(argv[2]) if len(argv) >= 3 else DEFAULT_RADIUS_M
    return lat, lng, radius


def run(lat: float, lng: float, radius_m: int) -> int:
    settings = get_settings()
    if not settings.opinet_api_key:
        console.print("[bold red]OPINET_API_KEY 가 .env 에 없습니다.[/]")
        return 1

    client = OpinetClient(settings.opinet_api_key)
    console.print(
        f"\n⛽ [bold]오일레이더[/] — 기준 ({lat:.4f}, {lng:.4f}) · 반경 {radius_m / 1000:g}km\n"
    )

    table = Table(show_header=True, header_style="bold")
    table.add_column("유종")
    table.add_column("최저가", justify="right")
    table.add_column("주유소")
    table.add_column("거리", justify="right")
    table.add_column("네이버지도")

    try:
        for fuel in PROD_CODES:
            stations = client.find_around(lat, lng, fuel, radius_m)
            result = cheapest_for_fuel(stations, fuel)
            label = FUEL_LABELS.get(fuel, fuel)
            if result.cheapest is None:
                table.add_row(label, "-", "[dim]반경 내 결과 없음[/]", "-", "-")
                continue
            s = result.cheapest
            table.add_row(
                label,
                f"₩{s.price:,}",
                f"{s.brand_name} {s.name}",
                f"{s.distance_m / 1000:.1f}km",
                naver_link.web_fallback(s.name),
            )
    finally:
        client.close()

    console.print(table)
    return 0


def main() -> int:
    settings = get_settings()
    lat, lng, radius = _parse_args(sys.argv[1:], settings)
    return run(lat, lng, radius)


if __name__ == "__main__":
    raise SystemExit(main())
