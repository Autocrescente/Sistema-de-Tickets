module.exports = {
  testEnvironment:  'node',
  setupFiles:       ['./tests/setup.js'],
  testMatch:        ['**/tests/**/*.test.js'],
  testTimeout:      120000,
  clearMocks:       true,
  verbose:          true,
};
