/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/utils/**/*.js'],
  coverageDirectory: 'coverage',
  verbose: true,
};
