// jestSetup.js or jestSetup.ts
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-google-signin
jest.mock('@react-native-google-signin/google-signin', () => {
  return {
    GoogleSignin: {
      configure: jest.fn(),
      signIn: jest.fn(() => Promise.resolve({idToken: 'mock-id-token'})),
      signInSilently: jest.fn(() =>
        Promise.resolve({idToken: 'mock-id-token'}),
      ),
      signOut: jest.fn(() => Promise.resolve(true)),
      revokeAccess: jest.fn(() => Promise.resolve(true)),
      isSignedIn: jest.fn(() => Promise.resolve(true)),
      getCurrentUser: jest.fn(() =>
        Promise.resolve({idToken: 'mock-id-token'}),
      ),
      getTokens: jest.fn(() =>
        Promise.resolve({
          idToken: 'mock-id-token',
          accessToken: 'mock-access-token',
        }),
      ),
    },
    statusCodes: {
      SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
      IN_PROGRESS: 'IN_PROGRESS',
      PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
      SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
    },
  };
});

// Mock react-native-bootsplash
jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn(() => Promise.resolve()),
    show: jest.fn(() => Promise.resolve()),
    getVisibilityStatus: jest.fn(() => Promise.resolve('hidden')),
  };
});
