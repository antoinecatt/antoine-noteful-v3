const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  }
});

tagSchema.set('timestamps', true);

tagSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
  }
});

module.exports = mongoose.model('Tag', tagSchema);