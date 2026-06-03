'use client';

import { Global, css } from '@emotion/react';

import { color } from './tokens';

/** WDS 기준 글로벌 리셋 + Pretendard 적용. */
export const GlobalStyles = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      body {
        font-family:
          Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo',
          system-ui, Roboto, sans-serif;
        background: ${color.background.alternative};
        color: ${color.label.normal};
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }
      button {
        font-family: inherit;
        cursor: pointer;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      #__next,
      main {
        height: 100%;
      }
    `}
  />
);
