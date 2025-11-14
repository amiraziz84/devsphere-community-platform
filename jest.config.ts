export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // 👇 Jest ko bata rahe hain ke "src/" root kaha hai
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  rootDir: '.',
  transform: { '^.+\\.ts$': 'ts-jest' },
};
