"""네이버지도 딥링크 생성.

모바일에서 링크 탭 시 네이버지도 앱을 실행해 해당 주유소 경로 안내로 연결한다.
앱 미설치 시 웹 fallback URL 을 사용한다.
"""

from __future__ import annotations

from urllib.parse import quote

APP_NAME = "com.oilradar"


def app_deeplink(station_name: str) -> str:
    """네이버지도 앱 딥링크 (nmap://)."""
    return f"nmap://search?query={quote(station_name)}&appname={APP_NAME}"


def web_fallback(station_name: str) -> str:
    """앱 미설치 시 웹 fallback URL."""
    return f"https://map.naver.com/search/{quote(station_name)}"
