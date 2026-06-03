import { breakpoint, color, mq, radius, shadow, spacing, typography } from './tokens';

/** Emotion 테마 객체 (WDS 토큰 기반). */
export const theme = {
  color,
  spacing,
  radius,
  shadow,
  typography,
  breakpoint,
  mq,
} as const;

export type AppTheme = typeof theme;

// Emotion 의 useTheme/styled 가 AppTheme 타입을 갖도록 선언 병합
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends AppTheme {}
}
