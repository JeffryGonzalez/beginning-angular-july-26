import { HttpHandler } from 'msw';

import bypassed from './bypassed-endpoints';
import addTrailHandlers from './trails/add-trail';
import trailsHandlers from './trails/trails';
const all: HttpHandler[] = [...trailsHandlers, ...addTrailHandlers];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
