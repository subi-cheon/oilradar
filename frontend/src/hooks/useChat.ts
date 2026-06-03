'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchStations } from '@/lib/mockData';
import { FUEL_LABEL } from '@/lib/types';

import type { ChatMessage, Fuel, Station } from '@/lib/types';

type Step = 'fuel' | 'location' | 'result' | 'free';

let seq = 0;
const uid = () => `m${++seq}`;

const botText = (text: string, chips?: ChatMessage['chips']): ChatMessage => ({
  id: uid(),
  role: 'bot',
  text,
  chips,
});

/**
 * 기획서 v3 §4 대화 흐름을 구현한 상태머신.
 * 1) 유종 선택 → 2) 위치 확인 → 3) 결과 제공 → 4) 자유 후속질문(현재는 mock).
 */
export const useChat = () => {
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [step, setStep] = useState<Step>('fuel');
  const [fuel, setFuel] = useState<Fuel | null>(null);
  const [stations, setStations] = useState<Array<Station>>([]);
  const [loading, setLoading] = useState(false);
  const started = useRef(false);

  const push = useCallback((...msgs: Array<ChatMessage>) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  // 최초 인사 + 유종 선택
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    push(
      botText('안녕하세요! 오일레이더입니다. ⛽\n어떤 연료를 기준으로 찾아 드릴까요?', [
        { label: '휘발유', value: 'gasoline' },
        { label: '경유', value: 'diesel' },
        { label: 'LPG', value: 'lpg' },
      ]),
    );
  }, [push]);

  const runSearch = useCallback(
    async (f: Fuel) => {
      setLoading(true);
      const list = await fetchStations(f);
      setStations(list);
      setLoading(false);
      const top = list[0];
      if (!top) {
        push(botText('근처 반경 10km 안에서는 주유소를 찾지 못했어요. 😢'));
        return;
      }
      push(
        botText(`현재 위치 근처에서 ${FUEL_LABEL[f]} 최저가 주유소를 찾았어요.`),
        { id: uid(), role: 'bot', station: top },
        botText('주변 주유소도 지도에 표시했어요. 더 궁금한 게 있으면 물어보세요!'),
      );
      setStep('free');
    },
    [push],
  );

  // 칩 선택 처리
  const selectChip = useCallback(
    (value: string) => {
      if (step === 'fuel') {
        const f = value as Fuel;
        setFuel(f);
        push({ id: uid(), role: 'user', text: FUEL_LABEL[f] });
        push(
          botText('위치 서비스에 동의하시면 근처에서 가장 싼 주유소를 찾아드려요.', [
            { label: '현재 위치 동의', value: 'geo' },
            { label: '주소 직접 입력', value: 'address' },
          ]),
        );
        setStep('location');
        return;
      }
      if (step === 'location' && fuel) {
        push({
          id: uid(),
          role: 'user',
          text: value === 'geo' ? '현재 위치 사용' : '주소 직접 입력',
        });
        void runSearch(fuel);
        setStep('result');
      }
    },
    [step, fuel, push, runSearch],
  );

  // 자유 입력 (현재는 간단 키워드 매칭 mock — 4단계에서 Claude 연동)
  const sendText = useCallback(
    (text: string) => {
      push({ id: uid(), role: 'user', text });
      const t = text.trim();
      if (/2위|두번째|다음/.test(t) && stations[1]) {
        push({ id: uid(), role: 'bot', station: stations[1] });
        return;
      }
      if (/가까|근처|제일 가까/.test(t) && stations.length) {
        const nearest = [...stations].sort((a, b) => a.distanceM - b.distanceM)[0];
        push(botText('거리 기준으로 가장 가까운 곳이에요.'), {
          id: uid(),
          role: 'bot',
          station: nearest,
        });
        return;
      }
      push(
        botText(
          '아직 데모 단계라 "2위는?", "제일 가까운 곳" 같은 질문에만 답할 수 있어요. (4단계에서 Claude 연동 예정)',
        ),
      );
    },
    [push, stations],
  );

  return { messages, loading, selectChip, sendText, stations, fuel };
};
