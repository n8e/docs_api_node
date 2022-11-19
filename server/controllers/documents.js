/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const moment = require('moment');
const Document = require('../models/documents');
const User = require('../models/users');

(function () {
  module.exports = {
    // get document by id
    get(req, res) {
      const { id } = req.params;
      Document.find(
        {
          _id: id,
        },
        (err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          res.send(documents);
        },
      );
    },

    // to get the mongo cluster of all the documents stored
    getAll(req, res) {
      Document.find({}, (err, documents) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(documents);
      });
    },

    create(req, res) {
      const document = new Document({
        ownerId: req.decoded._id,
        title: req.body.title,
        content: req.body.content,
      });
      document.save((err) => {
        if (err) {
          res.send(err);
          return;
        }
        res.send(document);
      });
    },

    // update document by id
    update(req, res) {
      const { id } = req.params;
      Document.findById(req.params.id).exec((err, document) => {
        if (err) {
          res.status(500).send({
            message: 'There was a problem deleting your document.',
          });
        } else if (!document) {
          res.status(404).send({
            message: 'No document found.',
          });
        } else if (
          req.decoded._id !== document.ownerId &&
          req.decoded.role === 'User'
        ) {
          // send 403 status and forbidden message
          res.status(403).send({
            message: 'Forbidden to update this document.',
          });
        } else {
          // delete or update
          Document.findOneAndUpdate(
            {
              _id: id,
            },
            {
              title: req.body.title,
              content: req.body.content,
            },
            {
              title: req.body.title,
              content: req.body.content,
            },
            (err, documents) => {
              if (err) {
                res.send(err);
              } else {
                res.json({
                  success: true,
                  message: 'Successfully updated Document!',
                });
              }
            },
          );
        }
      });
    },

    // delete document by id
    delete(req, res) {
      Document.findById(req.params.id).exec((err, document) => {
        if (err) {
          res.status(500).send({
            message: 'There was a problem deleting your document.',
          });
        } else if (!document) {
          res.status(404).send({
            message: 'No document found.',
          });
        } else if (
          req.decoded._id !== document.ownerId &&
          req.decoded.role === 'User'
        ) {
          // send 403 status and forbidden message
          res.status(403).send({
            message: 'Forbidden to delete this document.',
          });
        } else {
          // delete or update
          Document.findOneAndRemove({
            _id: req.params.id,
          }).exec((err, document) => {
            if (err) {
              return err;
            }
            res.status(200).json({
              message: document,
            });
          });
        }
      });
    },

    // to get the mongo cluster of all the documents filtered by 'User' role
    getAllDocumentsByRoleUser(req, res) {
      Document.find({})
        .populate('ownerId')
        .limit(4)
        .sort([['dateCreated', 'descending']])
        .exec((err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          const filtered = documents.filter(
            (obj) => obj.ownerId.role === 'User',
          );

          res.json(filtered);
        });
    },

    // cluster of all the documents filtered by 'Administrator' role
    getAllDocumentsByRoleAdministrator(req, res) {
      Document.find({})
        .populate('ownerId')
        .limit(4)
        .sort([['dateCreated', 'descending']])
        .exec((err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          const filtered = documents.filter(
            (obj) => obj.ownerId.role === 'Administrator',
          );

          res.json(filtered);
        });
    },

    // to get the mongo cluster of all the documents filtered by date
    getAllDocumentsByDate(req, res) {
      Document.find({
        dateCreated: {
          $gt: moment().subtract(1, 'day'),
          $lt: moment().add(1, 'day'),
        },
      })
        .limit(4)
        .exec((err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          res.json(documents);
        });
    },

    getAllDocumentsParticularUser(req, res) {
      const id = req.param('id');
      User.find(
        {
          ownerId: id,
        },
        (err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          res.json(documents);
        },
      );
    },
  };
})();
