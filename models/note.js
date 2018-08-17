const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: String,
  folderId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Folder'
  }
});

noteSchema.set('timestamps', true);

noteSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content
  }
}

module.exports = mongoose.model('Note', noteSchema);