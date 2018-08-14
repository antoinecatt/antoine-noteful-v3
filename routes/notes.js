'use strict';

const express = require('express');
const Note = require('../models/note');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {


  Note.find()
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

  Note.findById(req.params.id)
    .then(notes => res.json(notes.serialize()))
    .catch(err => {
      next(err);
    });

  console.log('Get a Note');
  res.json({ id: 1, title: 'Temp 1' });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const requiredFields = ['title', 'content'];
  for(let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in reques body`;
      next();
    }
  }

  Note.create({
    title: req.body.title,
    content: req.body.content
  })
    .then(note => res.status(201).json(note.serialize()))
    .catch(err => {
      next(err);
    });


  console.log('Create a Note');
  res.location('path/to/new/document').status(201).json({ id: 2, title: 'Temp 2' });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
    const message = (
      `Request path id (${req.params.id}) and request body id` + `(${req.body.id}) must match`);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if(field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Note.findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(note => res.status(204).end())
    .catch(err => {
      next(err);
    });

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err));

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;