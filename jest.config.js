module.exports = {
   roots: ['<rootDir>/tests'],
   transform: {
     '^.+\\.tsx?$': 'ts-jest',
   },
   testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
 }