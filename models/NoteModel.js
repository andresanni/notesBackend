const { Schema, model } = require('mongoose');

//Crear schema
const noteSchema = new Schema(
  {
    content: String,
    important: Boolean,
  },
  {
    versionKey: false,
  }
);

//Crear clase del modelo
const Note = model('Note', noteSchema);

module.exports = { Note };
