'use client';

import styled from '@emotion/styled';

export const ChipButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing[16]};
  border: 1px solid ${({ theme }) => theme.color.primary.normal};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.background.normal};
  color: ${({ theme }) => theme.color.primary.normal};
  font-size: ${({ theme }) => theme.typography.label1.fontSize};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.typography.label1.letterSpacing};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.color.primary.normal};
    color: ${({ theme }) => theme.color.static.white};
  }

  &:active {
    background: ${({ theme }) => theme.color.primary.strong};
  }
`;
