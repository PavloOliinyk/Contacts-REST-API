const mongoose = require('mongoose');
const request = require('supertest');
require('dotenv').config();

const app = require('../../app');
const { User } = require('../../models/user');

const { DB_TEST_HOST } = process.env;

describe('test signup', () => {
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach(done => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  afterEach(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  test('test signup route', async () => {
    const signupData = {
      email: 'test100@gmail.com',
      password: '000000',
    };

    const response = await request(app)
      .post('/api/users/signup')
      .send(signupData);

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toEqual({
      email: signupData.email,
      subscription: 'starter',
    });

    const user = await User.findOne({ ...response.body.user.email });
    expect(user).toBeTruthy();
    expect(user.token).toBeNull();
  });
});
