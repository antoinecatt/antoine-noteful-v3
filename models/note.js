const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: String,
  folderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder'},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true}
});

noteSchema.index({ title: 1, userId: 1 }, { unique: true });

noteSchema.set('timestamps', true);

noteSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    folderId: this.folderId,
    tags: this.tags,
    userId: this.userId
  };
};

module.exports = mongoose.model('Note', noteSchema);