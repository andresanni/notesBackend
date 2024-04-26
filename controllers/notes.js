const notesRouter = require('express').Router();
const Note = require('../models/note');


notesRouter.get('/', (req, res) => {
  Note.find({})
    .then((allNotes) => res.json(allNotes));    
});

notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404);
        res.json({ error: `id ${id} doesn't exist` });
      }
    })
    .catch((error) => {
      next(error);
    });
});

notesRouter.post('/', (req, res, next) => {
  const body = req.body;
  
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((error) => next(error));
});

notesRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
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
