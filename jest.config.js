module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jestSetupFile.ts'], // or 'jestSetup.ts' if using TypeScript
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
