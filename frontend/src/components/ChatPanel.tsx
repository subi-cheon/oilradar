'use client';

import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { useChat } from '@/hooks/useChat';

import { ChatBubble } from './ChatBubble';

import type { Station } from '@/lib/types';

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.color.background.alternative};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => `${theme.spacing[14]} ${theme.spacing[16]}`};
  background: ${({ theme }) => theme.color.background.normal};
  border-bottom: 1px solid ${({ theme }) => theme.color.line.solid};
  font-size: ${({ theme }) => theme.typography.headline1.fontSize};
  font-weight: 700;
`;

const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[16]};
  padding: ${({ theme }) => theme.spacing[16]};
`;

const InputBar = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.color.background.normal};
  border-top: 1px solid ${({ theme }) => theme.color.line.solid};
`;

const TextInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing[14]};
  border: 1px solid ${({ theme }) => theme.color.line.solid};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.color.primary.normal};
  }
`;

const SendButton = styled.button`
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing[20]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.primary.normal};
  color: ${({ theme }) => theme.color.static.white};
  font-weight: 600;

  &:disabled {
    background: ${({ theme }) => theme.color.interaction.inactive};
  }
`;

const Loading = styled.div`
  color: ${({ theme }) => theme.color.label.alternative};
  font-size: ${({ theme }) => theme.typography.label2.fontSize};
  padding-left: ${({ theme }) => theme.spacing[4]};
`;

export const ChatPanel = ({
  onStationsChange,
}: {
  onStationsChange?: (stations: Array<Station>) => void;
}) => {
  const { messages, loading, selectChip, sendText, stations } = useChat();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    onStationsChange?.(stations);
  }, [stations, onStationsChange]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    sendText(t);
    setDraft('');
  };

  return (
    <Panel>
      <Header>⛽ 오일레이더</Header>
      <Scroll ref={scrollRef}>
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} onChip={selectChip} />
        ))}
        {loading ? <Loading>최저가 주유소를 찾는 중…</Loading> : null}
      </Scroll>
      <InputBar onSubmit={submit}>
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="메시지를 입력하세요 (예: 2위는?)"
          aria-label="메시지 입력"
        />
        <SendButton type="submit" disabled={!draft.trim()}>
          전송
        </SendButton>
      </InputBar>
    </Panel>
  );
};
