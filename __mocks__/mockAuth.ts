// __mocks__/mockAuth.ts

jest.mock('@react-native-firebase/auth');

export const auth = jest.fn();

auth.mockImplementation(() => ({
  // Mock common methods
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {uid: 'mock-user-id', email: 'test@example.com'},
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {uid: 'mock-user-id', email: 'test@example.com'},
  }),
  signOut: jest.fn().mockResolvedValue(),
  // Add more methods as needed
  // ...
}));

export default auth;
