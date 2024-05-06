const { Schema, model } = require('mongoose');

//Crear schema
const noteSchema = new Schema(
  {
    content: { type: String, minLength: 5, required: true },
    important: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    versionKey: false,
  }
);

//Sobreescribir toJSON del schema para quitar campo V
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//Crear clase del modelo
const Note = model('Note', noteSchema);

module.exports = Note;
