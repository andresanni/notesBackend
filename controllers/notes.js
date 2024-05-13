const notesRouter = require('express').Router();
const { response } = require('express');
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  res.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);

  if (note) {
    res.json(note);
  } else {
    res.status(404);
    res.json({ error: `id ${id} doesn't exist` });
  }
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

notesRouter.post('/', async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  const savedNote = await note.save();

  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

notesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await Note.findByIdAndDelete(id);
  res.status(204).end();
});

notesRouter.put('/:id', (req, res, next) => {
  const { id } = req.params;

  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

module.exports = notesRouter;
