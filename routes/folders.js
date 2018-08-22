const express = require('express');
const mongoose = require('mongoose');
const Folder = require('../models/folder');
const router = express.Router();
const passport = require('passport');

// Protect endpoints using JWT Strategy
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

router.get('/', (req, res, next) => {

  const userId = req.user.id;

  Folder.find({userId})
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findOne({_id: id, userId})
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const { name, userId = req.user.id } = req.body;
  const newFolder = { name, userId };

  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });  

});

router.put('/:id', (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateFolder = { name };
  
  Folder.findOneAndUpdate({_id: id, userId },updateFolder, { new: true })
    .then(result => {
      if(result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  Folder.findByOneAndDelete({_id: id, userId})
    .then(() => res.status(204).end())
    .catch(err => next(err));

  console.log('Delete a Note');
  res.status(204).end();
  
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   const err = new Error('The `id` is not valid');
  //   err.status = 400;
  //   return next(err);
  // }
    
  // // ON DELETE SET NULL equivalent
  // const folderRemovePromise = Folder.findByIdAndRemove( id );
  // // ON DELETE CASCADE equivalent
  // // const noteRemovePromise = Note.deleteMany({ folderId: id });
    
  // const noteRemovePromise = Note.updateMany(
  //   { folderId: id },
  //   { $unset: { folderId: '' } }
  // );
      
  // Promise.all([folderRemovePromise, noteRemovePromise])
  //   .then(() => {
  //     res.status(204).end();
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
          
});



module.exports = router;
