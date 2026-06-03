'use client';

import { useState } from 'react';

import styled from '@emotion/styled';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { ChatPanel } from './ChatPanel';
import { MapPanel } from './MapPanel';

import type { Station } from '@/lib/types';

const Shell = styled.main`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  ${({ theme }) => theme.mq.desktop} {
    flex-direction: row;
  }
`;

const MapArea = styled.div<{ active: boolean }>`
  flex: 1;
  min-height: 0;
  display: ${({ active }) => (active ? 'block' : 'none')};
  ${({ theme }) => theme.mq.desktop} {
    display: block;
    flex: 1.4;
  }
`;

const ChatArea = styled.div<{ active: boolean }>`
  flex: 1;
  min-height: 0;
  display: ${({ active }) => (active ? 'block' : 'none')};
  ${({ theme }) => theme.mq.desktop} {
    display: block;
    flex: 1;
    max-width: 460px;
    border-left: 1px solid ${({ theme }) => theme.color.line.solid};
  }
`;

const TabBar = styled.nav`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.color.line.solid};
  background: ${({ theme }) => theme.color.background.normal};
  ${({ theme }) => theme.mq.desktop} {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  height: 56px;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.typography.label1.fontSize};
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.color.primary.normal : theme.color.label.assistive};
  border-top: 2px solid
    ${({ theme, active }) => (active ? theme.color.primary.normal : 'transparent')};
`;

type MobileTab = 'map' | 'chat';

export const AppShell = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [tab, setTab] = useState<MobileTab>('chat');
  const [stations, setStations] = useState<Array<Station>>([]);

  return (
    <Shell>
      <MapArea active={isDesktop || tab === 'map'}>
        <MapPanel stations={stations} />
      </MapArea>
      <ChatArea active={isDesktop || tab === 'chat'}>
        <ChatPanel onStationsChange={setStations} />
      </ChatArea>
      {!isDesktop ? (
        <TabBar>
          <Tab active={tab === 'map'} onClick={() => setTab('map')}>
            🗺️ 지도
          </Tab>
          <Tab active={tab === 'chat'} onClick={() => setTab('chat')}>
            💬 챗봇
          </Tab>
        </TabBar>
      ) : null}
    </Shell>
  );
};
