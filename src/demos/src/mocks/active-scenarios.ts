/**
 * Active scenario selection for MSW handlers.
 * This file is written by msw-lens — do not edit manually.
 * Keys are "METHOD endpoint", values are scenario names defined in the handler.
 */
const activeScenarios: Record<string, string> = {
  'GET https://api.fake-music-thing.com/bands': 'typical',
};

export default activeScenarios;
