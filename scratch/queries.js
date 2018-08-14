// const mongoose = require('mongoose');
// const { MONGODB_URI } = require('../config');

// const Note = require('../models/note');

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm };
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// /////////////////////////////////

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = '000000000000000000000004';

//     return Note.findById(searchTerm).sort({ updatedAt: 'desc' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.create({
//       title: 'New note',
//       content: 'new content'
//     });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     return Note.findByIdAndUpdate('000000000000000000000004', {$set: {title: 'Hello'}});
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

  