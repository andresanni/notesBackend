const mongoose = require('mongoose');
const { test, after, beforeEach } = require('node:test');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const assert = require('node:assert');
const Note = require('../models/note');

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});

  //Solucion con Promise.all, funciona pero no ejecuta promesas en un orden especifico
  //en este caso no molesta 
  // const notesObject = helper.initialNotes.map((note) => new Note(note));
  // const notesPromisesArray = notesObject.map((note) => note.save());
  // await Promise.all(notesPromisesArray);

  //Si quisieramos cuidar el orden, recurrimos a for...of
  const notesObject = helper.initialNotes.map(note => new Note(note));

  for(let note of notesObject){
    await note.save();
  } 
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-type', /application\/json/);
});

test('there are two notes', async () => {
  const response = await api.get('/api/notes');
  assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes');
  const contents = response.body.map((note) => note.content);

  assert.strictEqual(contents.includes('HTML is easy'), true);
});

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0]; //Consulta al modelo

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/); //Consulta a traves de la api

  assert.deepStrictEqual(resultNote.body, noteToView); //Compara ambas
});

test('a valid note can be added', async () => {
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

test('note without content is not added', async () => {
  const note = { important: true };

  await api.post('/api/notes').send(note).expect(400);

  const notesAtEnd = await helper.notesInDb();
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
});

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();
  const contents = notesAtEnd.map((note) => note.content);

  assert.strictEqual(notesAtStart.length - 1, notesAtEnd.length);
  assert(!contents.includes(noteToDelete.content));
});

after(async () => {
  await mongoose.connection.close();
});
