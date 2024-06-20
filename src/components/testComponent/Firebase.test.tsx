import auth from '../../../__mocks__/mockAuth'; // Import mocked auth

// Test cases using mocked auth methods
test('signs in with email and password successfully', async () => {
  await auth().signInWithEmailAndPassword('test@example.com', 'password');
  expect(auth().signInWithEmailAndPassword).toHaveBeenCalledWith(
    'test@example.com',
    'password',
  );
});

test('signs out successfully', async () => {
  await auth().signOut();
  expect(auth().signOut).toHaveBeenCalled();
});

// Add more test cases for other methods
// ...
