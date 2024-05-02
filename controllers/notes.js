const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (note) {
      res.json(note);
    } else {
      res.status(404);
      res.json({ error: `id ${id} doesn't exist` });
    }
  } catch (exception) {
    next(exception);
  }
});

notesRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    await Note.findByIdAndDelete(id);
    res.status(204).end();
  } catch (exception) {
    next(exception);
  }
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
