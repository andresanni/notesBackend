const mongoose = require('mongoose');
const { test, after, beforeEach, describe } = require('node:test');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const assert = require('node:assert');
const Note = require('../models/note');

const api = supertest(app);

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({});
    const notesObject = helper.initialNotes.map((note) => new Note(note));

    for (let note of notesObject) {
      await note.save();
    }
  });

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');
    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map((note) => note.content);

    assert(contents.includes('Browser can execute JavaScript'));
  });

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToView = notesAtStart[0];

      const request = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(noteToView, request.body);
    });

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNotExistingId = await helper.nonExistingId();
      await api.get(`/api/notes/${validNotExistingId}`).expect(404);
    });

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new note', async () => {
    test('succeeds with valid data', async () => {
      const note = {
        content: 'async/await simplifies making async calls',
        important: true,
      };

      await api
        .post('/api/notes')
        .send(note)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

      const contents = notesAtEnd.map((note) => note.content);
      assert(contents.includes('async/await simplifies making async calls'));
    });

    test('fails with status code 400 if data invalid', async () => {
      const note = { important: true };

      await api.post('/api/notes').send(note).expect(400);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
  });

  describe('deletion of a note', async () => {
    test('succeeds with code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await helper.notesInDb();
      const contents = notesAtEnd.map((note) => note.content);

      assert.strictEqual(notesAtStart.length - 1, notesAtEnd.length);
      assert(!contents.includes(noteToDelete.content));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
