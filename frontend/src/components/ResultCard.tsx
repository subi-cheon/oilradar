'use client';

import styled from '@emotion/styled';

import { naverWebFallback } from '@/lib/naverLink';
import { FUEL_LABEL } from '@/lib/types';

import type { Station } from '@/lib/types';

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.color.line.solid};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.background.normal};
  box-shadow: ${({ theme }) => theme.shadow.small};
  padding: ${({ theme }) => theme.spacing[16]};
`;

const Brand = styled.div`
  font-size: ${({ theme }) => theme.typography.caption1.fontSize};
  color: ${({ theme }) => theme.color.label.alternative};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Name = styled.div`
  font-size: ${({ theme }) => theme.typography.headline1.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.color.label.normal};
`;

const Price = styled.div`
  margin-top: ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.typography.title3.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.color.primary.normal};
`;

const Meta = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.label2.fontSize};
  color: ${({ theme }) => theme.color.label.neutral};
`;

const NaverButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[12]};
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.status.positive};
  color: ${({ theme }) => theme.color.static.white};
  font-size: ${({ theme }) => theme.typography.label1.fontSize};
  font-weight: 600;
`;

export const ResultCard = ({ station }: { station: Station }) => (
  <Card>
    <Brand>
      {station.brandName} · {FUEL_LABEL[station.fuel]}
    </Brand>
    <Name>{station.name}</Name>
    <Price>₩{station.price.toLocaleString()} / 리터</Price>
    <Meta>📍 {(station.distanceM / 1000).toFixed(1)}km · 실시간 오피넷 기준</Meta>
    <NaverButton
      href={naverWebFallback(station.name)}
      target="_blank"
      rel="noopener noreferrer"
    >
      네이버지도에서 경로 안내 →
    </NaverButton>
  </Card>
);
