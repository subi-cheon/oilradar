'use client';

import styled from '@emotion/styled';

import { ChipButton } from './ChipButton';
import { ResultCard } from './ResultCard';

import type { ChatMessage } from '@/lib/types';

const Row = styled.div<{ role: 'bot' | 'user' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Bubble = styled.div<{ role: 'bot' | 'user' }>`
  max-width: 84%;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[14]}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  line-height: ${({ theme }) => theme.typography.body2.lineHeight};
  white-space: pre-wrap;
  word-break: keep-all;
  ${({ role, theme }) =>
    role === 'user'
      ? `background:${theme.color.primary.normal};color:${theme.color.static.white};border-bottom-right-radius:${theme.radius.sm};`
      : `background:${theme.color.background.normal};color:${theme.color.label.normal};border:1px solid ${theme.color.line.solid};border-bottom-left-radius:${theme.radius.sm};`}
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[8]};
`;

interface Props {
  message: ChatMessage;
  onChip: (value: string) => void;
}

export const ChatBubble = ({ message, onChip }: Props) => (
  <Row role={message.role}>
    {message.text ? <Bubble role={message.role}>{message.text}</Bubble> : null}
    {message.station ? <ResultCard station={message.station} /> : null}
    {message.chips ? (
      <Chips>
        {message.chips.map((c) => (
          <ChipButton key={c.value} onClick={() => onChip(c.value)}>
            {c.label}
          </ChipButton>
        ))}
      </Chips>
    ) : null}
  </Row>
);
