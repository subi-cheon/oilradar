import type { Fuel, Station } from './types';

/**
 * 임시 mock 주유소 데이터 (대전 둔산동 인근).
 * TODO(4단계): 백엔드 /api/cheapest 엔드포인트로 교체.
 */
const MOCK: Record<Fuel, Array<Station>> = {
  gasoline: [
    { uniId: 'g1', name: 'GS칼텍스 둔산점', brandName: 'GS칼텍스', fuel: 'gasoline', price: 1623, lat: 36.351, lng: 127.382, distanceM: 2100 },
    { uniId: 'g2', name: 'SK에너지 갈마점', brandName: 'SK에너지', fuel: 'gasoline', price: 1641, lat: 36.345, lng: 127.39, distanceM: 4300 },
    { uniId: 'g3', name: 'HD현대오일 갈마점', brandName: '현대오일뱅크', fuel: 'gasoline', price: 1658, lat: 36.349, lng: 127.388, distanceM: 1300 },
  ],
  diesel: [
    { uniId: 'd1', name: '현대오일뱅크 OK주유소', brandName: '현대오일뱅크', fuel: 'diesel', price: 1441, lat: 36.353, lng: 127.379, distanceM: 4000 },
    { uniId: 'd2', name: 'GS칼텍스 둔산점', brandName: 'GS칼텍스', fuel: 'diesel', price: 1463, lat: 36.351, lng: 127.382, distanceM: 2100 },
  ],
  lpg: [
    { uniId: 'l1', name: 'SK에너지 행복충전소', brandName: 'SK에너지', fuel: 'lpg', price: 992, lat: 36.34, lng: 127.395, distanceM: 5300 },
  ],
};

/** 반경 내 해당 유종 주유소(가격 오름차순)를 흉내내는 mock fetch. */
export const fetchStations = async (fuel: Fuel): Promise<Array<Station>> => {
  await new Promise((r) => setTimeout(r, 450));
  return [...MOCK[fuel]].sort((a, b) => a.price - b.price || a.distanceM - b.distanceM);
};
