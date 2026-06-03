"""네이버지도 딥링크 생성 테스트."""

from backend import naver_link


def test_app_deeplink_encodes_query():
    link = naver_link.app_deeplink("GS칼텍스 둔산점")
    assert link.startswith("nmap://search?query=")
    assert "appname=com.oilradar" in link
    assert " " not in link  # 공백은 인코딩되어야


def test_web_fallback():
    link = naver_link.web_fallback("SK에너지 갈마점")
    assert link.startswith("https://map.naver.com/search/")
    assert " " not in link
