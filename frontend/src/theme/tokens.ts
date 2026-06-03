/**
 * WDS(Montage) 디자인 토큰을 로컬에 복제한 값.
 *
 * @wanteddev/wds 패키지는 GitHub Packages 비공개 레지스트리라 직접 설치하지 않고,
 * montage-web/packages/wds-theme 의 빌드 결과에서 추출한 **실제 토큰 값**을 그대로 옮겼다.
 * (light 테마 기준 · WDS v3.8.1) — 임의 색/간격 하드코딩 금지, 항상 이 토큰만 사용.
 */

export const color = {
  static: { white: '#ffffff', black: '#000000' },
  primary: { normal: '#0066FF', strong: '#005EEB', heavy: '#0054D1' },
  label: {
    normal: '#171719',
    strong: '#000000',
    neutral: '#2E2F33E0',
    alternative: '#37383C9C',
    assistive: '#37383C47',
    disable: '#37383C29',
  },
  background: {
    normal: '#ffffff',
    alternative: '#F7F7F8',
  },
  line: {
    normal: '#70737C38',
    neutral: '#70737C29',
    solid: '#E1E2E4',
    solidNeutral: '#EAEBEC',
    solidAlternative: '#F4F4F5',
  },
  status: { positive: '#00BF40', cautionary: '#FF9200', negative: '#FF4242' },
  fill: { normal: '#70737C14', strong: '#70737C29', alternative: '#70737C0D' },
  interaction: { inactive: '#989BA2', disable: '#F4F4F5' },
  // 유종 색 (WDS accent 팔레트 기반)
  fuel: {
    gasoline: '#00BF40', // 휘발유 — green
    diesel: '#0066FF',   // 경유 — blue
    lpg: '#FF9200',      // LPG — orange
  },
} as const;

/** WDS spacing scale (px) */
export const spacing = {
  0: '0px', 2: '2px', 4: '4px', 6: '6px', 8: '8px', 10: '10px', 12: '12px',
  14: '14px', 16: '16px', 20: '20px', 24: '24px', 32: '32px', 40: '40px',
  48: '48px', 56: '56px', 64: '64px', 72: '72px', 80: '80px',
} as const;

export const radius = {
  sm: '8px', md: '12px', lg: '16px', xl: '20px', full: '999px',
} as const;

export const shadow = {
  xsmall: '0px 1px 2px -1px #1717171A',
  small: '0px 2px 4px -2px #1717170F, 0px 4px 6px -1px #1717170F',
  medium: '0px 4px 6px -2px #17171712, 0px 10px 15px -3px #17171712',
  large: '0px 6px 10px -4px #17171714, 0px 16px 24px -6px #17171714',
} as const;

/** WDS Typography variant scale (rem). [fontSize, lineHeight, letterSpacing] */
export const typography = {
  title2: { fontSize: '1.75rem', lineHeight: '2.375rem', letterSpacing: '-0.0236em', fontWeight: 700 },
  title3: { fontSize: '1.5rem', lineHeight: '2rem', letterSpacing: '-0.023em', fontWeight: 700 },
  heading1: { fontSize: '1.375rem', lineHeight: '1.875rem', letterSpacing: '-0.0194em', fontWeight: 600 },
  heading2: { fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: '-0.012em', fontWeight: 600 },
  headline1: { fontSize: '1.125rem', lineHeight: '1.625rem', letterSpacing: '-0.002em', fontWeight: 600 },
  body1: { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0.0057em', fontWeight: 400 },
  body2: { fontSize: '0.9375rem', lineHeight: '1.375rem', letterSpacing: '0.0096em', fontWeight: 400 },
  label1: { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.0145em', fontWeight: 500 },
  label2: { fontSize: '0.8125rem', lineHeight: '1.125rem', letterSpacing: '0.0194em', fontWeight: 500 },
  caption1: { fontSize: '0.75rem', lineHeight: '1rem', letterSpacing: '0.0252em', fontWeight: 500 },
} as const;

export const breakpoint = {
  sm: '768px',
  md: '992px',
  lg: '1200px',
} as const;

/** 모바일 기준 미디어쿼리 (모바일 우선) */
export const mq = {
  /** 데스크탑(분할 레이아웃) 진입 지점 */
  desktop: `@media (min-width: ${breakpoint.sm})`,
} as const;
