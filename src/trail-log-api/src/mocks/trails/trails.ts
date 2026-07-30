import { http, HttpHandler, HttpResponse, delay } from 'msw';

import activeScenarios from '../active-scenarios';
import { Trail } from '../../app/trails/types';

const ENDPOINT = 'http://localhost:3000/trails';

const typicalResponse: Trail[] = [
  {
    id: 'bear-lake-loop',
    name: 'Bear Lake Loop',
    miles: 0.8,
    difficulty: 'easy',
  },
  {
    id: 'fern-canyon-loop',
    name: 'Fern Canyon Loop',
    miles: 1.1,
    difficulty: 'easy',
  },
  {
    id: 'emerald-lake-trail',
    name: 'Emerald Lake Trail',
    miles: 3.2,
    difficulty: 'easy',
  },
  {
    id: 'delicate-arch-trail',
    name: 'Delicate Arch Trail',
    miles: 3.2,
    difficulty: 'moderate',
  },
  {
    id: 'cadillac-north-ridge',
    name: 'Cadillac North Ridge Trail',
    miles: 4.4,
    difficulty: 'moderate',
  },
  {
    id: 'mist-trail-vernal-fall',
    name: 'Mist Trail to Vernal Fall',
    miles: 2.4,
    difficulty: 'moderate',
  },
  {
    id: 'skyline-trail-loop',
    name: 'Skyline Trail Loop',
    miles: 5.5,
    difficulty: 'hard',
  },
  {
    id: 'alum-cave-to-leconte',
    name: 'Alum Cave Trail to Mount LeConte',
    miles: 11,
    difficulty: 'hard',
  },
  {
    id: 'bright-angel-trail',
    name: 'Bright Angel Trail',
    miles: 9.5,
    difficulty: 'hard',
  },
  {
    id: 'angels-landing',
    name: 'Angels Landing',
    miles: 5.4,
    difficulty: 'extreme',
  },
  {
    id: 'half-dome-via-mist-trail',
    name: 'Half Dome via the Mist Trail',
    miles: 14.2,
    difficulty: 'extreme',
  },
];

const singleTrailResponse: Trail[] = [
  {
    id: 'chasm-lake-trail',
    name: 'Chasm Lake Trail',
    miles: 8.4,
    difficulty: 'hard',
  },
];

const DIFFICULTIES: Trail['difficulty'][] = ['easy', 'moderate', 'hard', 'extreme'];

const overloadedResponse: Trail[] = Array.from({ length: 60 }, (_, index) => ({
  id: `trail-${index + 1}`,
  name: `Ridge Runner Trail Segment ${index + 1}`,
  miles: Number((0.5 + index * 0.35).toFixed(1)),
  difficulty: DIFFICULTIES[index % DIFFICULTIES.length],
}));

// Two records share a name — the list tracks by name, not id.
const duplicateNamesResponse: Trail[] = [
  {
    id: 'lost-lake-trail-co',
    name: 'Lost Lake Trail',
    miles: 4.1,
    difficulty: 'moderate',
  },
  {
    id: 'lost-lake-trail-or',
    name: 'Lost Lake Trail',
    miles: 6.7,
    difficulty: 'hard',
  },
  {
    id: 'crater-lake-rim',
    name: 'Crater Lake Rim Trail',
    miles: 5.9,
    difficulty: 'moderate',
  },
];

const unknownDifficultyResponse = [
  {
    id: 'the-narrows-bottom-up',
    name: 'The Narrows, Bottom Up',
    miles: 9.4,
    difficulty: 'strenuous',
  },
  {
    id: 'kalalau-trail',
    name: 'Kalalau Trail',
    miles: 22,
    difficulty: 'expert-only',
  },
  {
    id: 'harding-icefield-trail',
    name: 'Harding Icefield Trail',
    miles: 8.2,
    difficulty: 'hard',
  },
] as unknown as Trail[];

const missingIdsResponse = [
  {
    name: 'Devils Garden Primitive Loop',
    miles: 7.9,
    difficulty: 'hard',
  },
  {
    name: 'Hanging Lake Trail',
    miles: 2.4,
    difficulty: 'moderate',
  },
  {
    id: '',
    name: 'Sky Pond via Glacier Gorge',
    miles: 9,
    difficulty: 'hard',
  },
] as unknown as Trail[];

const fractionalMilesResponse: Trail[] = [
  {
    id: 'sol-duc-falls-trail',
    name: 'Sol Duc Falls Trail',
    miles: 1.1,
    difficulty: 'easy',
  },
  {
    id: 'hoh-river-trail',
    name: 'Hoh River Trail',
    miles: 2.2,
    difficulty: 'easy',
  },
  {
    id: 'marymere-falls-trail',
    name: 'Marymere Falls Trail',
    miles: 3.3,
    difficulty: 'easy',
  },
  {
    id: 'hurricane-hill-trail',
    name: 'Hurricane Hill Trail',
    miles: 0.7,
    difficulty: 'moderate',
  },
];

const zeroAndNegativeMilesResponse: Trail[] = [
  {
    id: 'trailhead-overlook',
    name: 'Trailhead Overlook',
    miles: 0,
    difficulty: 'easy',
  },
  {
    id: 'unsurveyed-spur',
    name: 'Unsurveyed Spur',
    miles: -2.5,
    difficulty: 'moderate',
  },
  {
    id: 'grinnell-glacier-trail',
    name: 'Grinnell Glacier Trail',
    miles: 10.3,
    difficulty: 'hard',
  },
];

const malformedResponse = [
  {
    id: 'no-miles-recorded',
    name: 'Old Rag Mountain Loop',
    difficulty: 'hard',
  },
  {
    id: 'null-miles',
    name: 'Precipice Trail',
    miles: null,
    difficulty: 'extreme',
  },
  {
    id: 'no-difficulty',
    name: 'Ice Age Trail, Devils Lake Segment',
    miles: 4.5,
  },
  {
    id: 'nameless',
    miles: 3.1,
    difficulty: 'moderate',
  },
] as unknown as Trail[];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'single-trail':
        return HttpResponse.json(singleTrailResponse);
      case 'overloaded':
        return HttpResponse.json(overloadedResponse);
      case 'duplicate-names':
        return HttpResponse.json(duplicateNamesResponse);
      case 'unknown-difficulty':
        return HttpResponse.json(unknownDifficultyResponse);
      case 'missing-ids':
        return HttpResponse.json(missingIdsResponse);
      case 'fractional-miles':
        return HttpResponse.json(fractionalMilesResponse);
      case 'zero-and-negative-miles':
        return HttpResponse.json(zeroAndNegativeMilesResponse);
      case 'malformed-data':
        return HttpResponse.json(malformedResponse);
      case 'slow':
        await delay(2500);
        return HttpResponse.json(typicalResponse);
      case 'timeout':
        await delay('infinite');
        return HttpResponse.json(typicalResponse);
      case 'unauthorized':
        return new HttpResponse(null, { status: 401 });
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
