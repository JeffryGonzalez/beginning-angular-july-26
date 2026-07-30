import { HttpHandler } from 'msw';

import musicBands from './music/bands';
import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [...musicBands];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
