/** 네이버지도 딥링크 (백엔드 naver_link.py 와 동일 규칙). */

const APP_NAME = 'com.oilradar';

export const naverAppDeeplink = (stationName: string) =>
  `nmap://search?query=${encodeURIComponent(stationName)}&appname=${APP_NAME}`;

export const naverWebFallback = (stationName: string) =>
  `https://map.naver.com/search/${encodeURIComponent(stationName)}`;

/**
 * 모바일이면 앱 딥링크, 아니면 웹 fallback.
 * (실제 앱 실행 실패 시 fallback 전환은 추후 클릭 핸들러에서 보강)
 */
export const naverLink = (stationName: string) => naverWebFallback(stationName);
