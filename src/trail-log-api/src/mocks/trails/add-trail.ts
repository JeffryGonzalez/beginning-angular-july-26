import { http, HttpHandler, HttpResponse, delay } from 'msw';

import activeScenarios from '../active-scenarios';
import { Trail, TrailCreate } from '../../app/trails/types';

const ENDPOINT = 'http://localhost:3010/trails';

// Echo the submitted trail back with a slug-ish id, the way the real API would.
const created = (trail: TrailCreate): Trail => ({
  id:
    (trail.name ?? 'new-trail')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'new-trail',
  name: trail.name,
  miles: trail.miles,
  difficulty: trail.difficulty,
});

export default [
  http.post(ENDPOINT, async ({ request }) => {
    const scenario = activeScenarios[`POST ${ENDPOINT}`] ?? 'success';
    const body = (await request.json()) as TrailCreate;

    switch (scenario) {
      case 'slow':
        await delay(3000);
        return HttpResponse.json(created(body), { status: 201 });
      case 'success':
      default:
        return HttpResponse.json(created(body), { status: 201 });
    }
  }),
] as HttpHandler[];
