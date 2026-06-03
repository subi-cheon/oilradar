'use client';

import { useState } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

import { GlobalStyles } from '@/theme/global';
import { theme } from '@/theme';

import type { ReactNode } from 'react';

/**
 * Next.js App Router 용 Emotion SSR 레지스트리 + WDS 테마/글로벌 스타일 주입.
 * 서버에서 생성된 스타일을 useServerInsertedHTML 로 flush 해 FOUC 를 막는다.
 */
export const Providers = ({ children }: { children: ReactNode }) => {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'wds', prepend: true });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: Array<string> = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
