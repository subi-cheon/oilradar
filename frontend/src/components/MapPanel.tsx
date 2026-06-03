'use client';

import { useEffect, useRef } from 'react';

import styled from '@emotion/styled';

import { FUEL_LABEL } from '@/lib/types';

import type { Station } from '@/lib/types';

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const CENTER = { lat: 36.3504, lng: 127.3845 }; // 대전 둔산동 기본
const RADIUS_M = 10_000;

const Wrap = styled.section`
  position: relative;
  height: 100%;
  background: ${({ theme }) => theme.color.line.solidAlternative};
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Placeholder = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[16]};
  padding: ${({ theme }) => theme.spacing[24]};
  overflow-y: auto;
`;

const Notice = styled.div`
  padding: ${({ theme }) => theme.spacing[16]};
  border: 1px dashed ${({ theme }) => theme.color.line.normal};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.background.normal};
  color: ${({ theme }) => theme.color.label.neutral};
  font-size: ${({ theme }) => theme.typography.label1.fontSize};
  line-height: ${({ theme }) => theme.typography.body1.lineHeight};
`;

const Pin = styled.div<{ top?: boolean }>`
  padding: ${({ theme }) => theme.spacing[12]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.background.normal};
  border: 1px solid
    ${({ theme, top }) => (top ? theme.color.primary.normal : theme.color.line.solid)};
  box-shadow: ${({ theme }) => theme.shadow.xsmall};
  font-size: ${({ theme }) => theme.typography.label1.fontSize};
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Price = styled.strong<{ top?: boolean }>`
  color: ${({ theme, top }) => (top ? theme.color.primary.normal : theme.color.label.normal)};
`;

declare global {
  interface Window {
    kakao?: any;
  }
}

/** 카카오맵 패널. 키가 없으면 마커 리스트 플레이스홀더로 대체. */
export const MapPanel = ({ stations }: { stations: Array<Station> }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<any>(null);
  const overlays = useRef<Array<any>>([]);

  // SDK 로드 + 지도 초기화
  useEffect(() => {
    if (!KAKAO_KEY || !mapRef.current) return;
    const init = () => {
      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(CENTER.lat, CENTER.lng);
        mapObj.current = new window.kakao.maps.Map(mapRef.current, { center, level: 7 });
        new window.kakao.maps.Circle({
          center,
          radius: RADIUS_M,
          strokeWeight: 1,
          strokeColor: '#0066FF',
          strokeStyle: 'dashed',
          fillColor: '#0066FF',
          fillOpacity: 0.04,
        }).setMap(mapObj.current);
      });
    };
    if (window.kakao?.maps) {
      init();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, []);

  // 주유소 마커 동기화
  useEffect(() => {
    if (!mapObj.current || !window.kakao?.maps) return;
    overlays.current.forEach((o) => o.setMap(null));
    overlays.current = stations.map((s, i) => {
      const content = document.createElement('div');
      content.style.cssText = `padding:4px 8px;border-radius:8px;font-size:12px;font-weight:600;color:#fff;background:${
        i === 0 ? '#0066FF' : '#37383C'
      };box-shadow:0 1px 2px rgba(0,0,0,.2)`;
      content.textContent = `${s.brandName} ₩${s.price.toLocaleString()}`;
      const ov = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(s.lat, s.lng),
        content,
        yAnchor: 1.4,
      });
      ov.setMap(mapObj.current);
      return ov;
    });
  }, [stations]);

  if (!KAKAO_KEY) {
    return (
      <Wrap>
        <Placeholder>
          <Notice>
            🗺️ 카카오맵은 <code>NEXT_PUBLIC_KAKAO_MAP_KEY</code> 설정 후 표시됩니다.
            <br />
            지금은 챗봇 결과를 아래 목록으로 보여드려요. (반경 {RADIUS_M / 1000}km)
          </Notice>
          {stations.length === 0 ? (
            <Notice>챗봇에서 유종을 선택하면 주변 주유소가 여기에 표시됩니다.</Notice>
          ) : (
            stations.map((s, i) => (
              <Pin key={s.uniId} top={i === 0}>
                <span>
                  {i === 0 ? '⭐ ' : ''}
                  {s.brandName} {s.name} · {FUEL_LABEL[s.fuel]}
                </span>
                <Price top={i === 0}>
                  ₩{s.price.toLocaleString()} ({(s.distanceM / 1000).toFixed(1)}km)
                </Price>
              </Pin>
            ))
          )}
        </Placeholder>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <MapDiv ref={mapRef} />
    </Wrap>
  );
};
