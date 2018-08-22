'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');
const router = express.Router();
const passport = require('passport');


// Protect endpoints using JWT Strategy
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { folderId, tagId } = req.query; 
  const userId = req.user.id;

  let filter = {userId};

  if(folderId) {
    filter.folderId = folderId;
  }

  if(tagId) {
    filter.tagId = tagId;
  }

  Note.find(filter)
    .populate('tags')
    .then(notes => { 
      res.json({
        notes: notes.map(note => note.serialize())
      });
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  Note.findOne({_id: id, userId})
    .populate('tags')
    .then(notes => res.json(notes.serialize()))
    .catch(err => {
      next(err);
    });

  console.log('Get a Note');
  res.json({ id: 1, title: 'Temp 1' });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const { title, content, folderId, tags = [], userId = req.user.id } = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('The `userId` is not valid');
      err.status = 400;
      return next(err);
    }

    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  if (tags) {
    tags.forEach((tag) => {
      // verify the tags property is an Array, if validation fails, then return 'The tags property must be an array' with a status 400. ===> NEED TODO

      if (!mongoose.Types.ObjectId.isValid(tag)) {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
          const err = new Error('The `id` is not valid');
          err.status = 400;
          return next(err);
        }

        const err = new Error('The tags array contains an invalid id');
        err.status = 400;
        return next(err);
      }
    });
  }

  const newNote = { title, content, folderId, tags, userId };

  Note.create(newNote)
    .then(note => res.json(note.serialize()))
    .catch(err => {
      next(err);
    });

  console.log('Create a Note');
  // res.location('path/to/new/document').status(201).json({ id: 2, title: 'Temp 2' });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }

    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  if (tags) {
    tags.forEach(tag => {
      if(!mongoose.Types.ObjectId.isValid(tag)) {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
          const err = new Error('The `id` is not valid');
          err.status = 400;
          return next(err);
        }

        const err = new Error('The `id` is not valid');
        err.status = 400;
        return next(err);
      }
    });
  }

  const updateNote = { title, content, folderId, tags };

  Note.findOneAndUpdate({_id: id, userId}, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findOneAndDelete({_id: id, userId})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;