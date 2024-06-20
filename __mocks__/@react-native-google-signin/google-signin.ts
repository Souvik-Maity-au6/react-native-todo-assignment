// __mocks__/@react-native-google-signin/google-signin.ts

export const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
};

export const GoogleSignin = {
  configure: jest.fn(),
  signIn: jest.fn(() => Promise.resolve({idToken: 'mock-id-token'})),
  signInSilently: jest.fn(() => Promise.resolve({idToken: 'mock-id-token'})),
  signOut: jest.fn(() => Promise.resolve(true)),
  revokeAccess: jest.fn(() => Promise.resolve(true)),
  isSignedIn: jest.fn(() => Promise.resolve(true)),
  getCurrentUser: jest.fn(() => Promise.resolve({idToken: 'mock-id-token'})),
  getTokens: jest.fn(() =>
    Promise.resolve({
      idToken: 'mock-id-token',
      accessToken: 'mock-access-token',
    }),
  ),
};
