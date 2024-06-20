// __mocks__/react-native-bootsplash.ts

const mock = {
  hide: jest.fn(() => Promise.resolve()),
  show: jest.fn(() => Promise.resolve()),
  getVisibilityStatus: jest.fn(() => Promise.resolve('hidden')),
};

export default mock;
