"""환경설정 및 상수.

`.env`를 읽어 설정값을 제공하고, 유종 코드/라벨 등 도메인 상수를 모아둔다.
"""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict

# ── 도메인 상수 ──────────────────────────────────────────────

# 오피넷 aroundAll.do 의 radius 최댓값은 5000m(5km).
# 기획서 기본값은 10km이므로, opinet.py 에서 그리드 분할 다중 호출로 커버한다.
OPINET_MAX_RADIUS_M = 5000
DEFAULT_RADIUS_M = 10_000  # 기획서 v3 기본 반경

# 유종 코드 (오피넷 prodcd)
PROD_CODES: dict[str, str] = {
    "gasoline": "B027",  # 휘발유(보통)
    "diesel": "D047",    # 경유
    "lpg": "K015",       # 자동차용 LPG(부탄)
}

# 유종 한글 라벨 + 이모지 (콘솔/메시지 표시용)
FUEL_LABELS: dict[str, str] = {
    "gasoline": "🟢 휘발유",
    "diesel": "🔵 경유",
    "lpg": "🟡 LPG",
}

# 오피넷 브랜드 코드 → 한글명
BRAND_NAMES: dict[str, str] = {
    "SKE": "SK에너지",
    "GSC": "GS칼텍스",
    "HDO": "현대오일뱅크",
    "SOL": "S-OIL",
    "RTE": "자영알뜰",
    "RTX": "고속도로알뜰",
    "NHO": "농협알뜰",
    "ETC": "자가상표",
    "E1G": "E1",
    "SKG": "SK가스",
}


class Settings(BaseSettings):
    """`.env` 기반 런타임 설정."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    opinet_api_key: str = ""
    kakao_rest_api_key: str = ""
    anthropic_api_key: str = ""
    database_url: str = "sqlite:///./oilradar.db"

    # 콘솔 데모 기본 좌표 (대전 둔산동)
    default_lat: float = 36.3504
    default_lng: float = 127.3845


def get_settings() -> Settings:
    """설정 싱글턴 반환."""
    return Settings()
