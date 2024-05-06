const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { test, after, beforeEach, describe } = require('node:test');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const assert = require('node:assert');
const User = require('../models/user');

const api = supertest(app);

describe.only('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test.only('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    const userNames = usersAtEnd.map((user) => user.username);

    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length);
    assert(userNames.includes('mluukkai'));
  });

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Impostor',
      password: 'salainen',
    };

    const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    assert(result.body.error.includes('expected `username` to be unique'));

  });
});

after(async () => {
  await mongoose.connection.close();
});
