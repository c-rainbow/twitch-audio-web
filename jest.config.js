const {defaults} = require('jest-config');

module.exports = {
  roots: ['<rootDir>'],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    '^.+\\.tsx?$': 'ts-jest',
    "^.+\\.html?$": "html-loader-jest"
  },
  testRegex: '(./tests/).*_test.[jt]sx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  verbose: true,
  automock: false,
  preset: 'ts-jest',
  setupFiles: ["./tests/setupJest.js", "jest-webextension-mock"]
}