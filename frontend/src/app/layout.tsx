import { Providers } from './providers';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '오일레이더 — 내 주변 최저가 주유소',
  description:
    '챗봇에게 물어보면 오피넷 공공데이터로 반경 10km 내 최저가 주유소를 지도에 찾아줍니다.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0066FF',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <html lang="ko">
    <head>
      {/* WDS 권장 폰트 — Pretendard */}
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
      />
    </head>
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
