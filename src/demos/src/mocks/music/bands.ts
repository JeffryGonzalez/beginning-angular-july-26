import { http, HttpHandler, HttpResponse, delay } from 'msw';

import activeScenarios from '../active-scenarios';
import { Band } from '../../app/demonstrations/types';

const ENDPOINT = 'https://api.fake-music-thing.com/bands';

const typicalResponse: Band[] = [
  {
    id: 'yes',
    name: 'Yes',
    albums: ['Fragile', 'Close to the Edge', '90125'],
  },
  {
    id: 'king-crimson',
    name: 'King Crimson',
    albums: ['In the Court of the Crimson King', 'Red', 'Discipline'],
  },
  {
    id: 'rush',
    name: 'Rush',
    albums: ['2112', 'Moving Pictures', 'Hemispheres'],
  },
];

const overloadedResponse: Band[] = Array.from({ length: 24 }, (_, index) => ({
  id: `band-${index + 1}`,
  name: `Band ${index + 1}`,
  albums: [`Album ${index + 1}A`, `Album ${index + 1}B`],
}));

const malformedResponse = [
  {
    id: 'partial-band',
    name: 'Partial Band',
  },
  {
    id: 'null-albums',
    name: 'Null Albums',
    albums: null,
  },
] as unknown as Band[];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'overloaded':
        return HttpResponse.json(overloadedResponse);
      case 'unauthorized':
        return new HttpResponse(null, { status: 401 });
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'slow':
        await delay(4000);
        return HttpResponse.json(typicalResponse);
      case 'slow-and-empty':
        await delay(4000);
        return HttpResponse.json([]);
      case 'timeout':
        await delay('infinite');
        return HttpResponse.json(typicalResponse);
      case 'malformed-data':
        return HttpResponse.json(malformedResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
