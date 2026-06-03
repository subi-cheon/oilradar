/** 프론트 공용 도메인 타입 (백엔드 모델과 정합). */

export type Fuel = 'gasoline' | 'diesel' | 'lpg';

export const FUEL_LABEL: Record<Fuel, string> = {
  gasoline: '휘발유',
  diesel: '경유',
  lpg: 'LPG',
};

export interface Station {
  uniId: string;
  name: string;
  brandName: string;
  fuel: Fuel;
  price: number;
  lat: number;
  lng: number;
  distanceM: number;
}

export type ChatRole = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** 일반 텍스트 말풍선 */
  text?: string;
  /** 주유소 결과 카드 */
  station?: Station;
  /** 선택 칩 버튼 묶음 */
  chips?: Array<{ label: string; value: string }>;
}
