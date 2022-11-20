/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const moment = require('moment');
const Document = require('../models/documents');
const User = require('../models/users');

module.exports = {
  // get document by id
  get(req, res) {
    const { id } = req.params;

    return Document.find({ _id: id })
      .then((documents) => res.json(documents))
      .catch((err) => res.send(err));
  },

  // to get the mongo cluster of all the documents stored
  getAll(req, res) {
    const { page, limit } = req.params;

    return Document.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .then((documents) => res.json(documents))
      .catch((err) => res.send(err));
  },

  create(req, res) {
    const document = new Document({
      ownerId: req.decoded._id,
      title: req.body.title,
      content: req.body.content,
    });

    return document
      .save()
      .then((documents) => res.json(documents))
      .catch((err) => res.send(err));
  },

  // update document by id
  update(req, res) {
    // update only allowed for authorised user of their own documents or admin
    const isPermittedUser =
      req.decoded.role === 'Administrator' || req.decoded._id === req.params.id;

    if (!isPermittedUser) {
      return res.json(403, {
        message: 'Forbidden to update this document.',
      });
    }

    return Document.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        content: req.body.content,
      },
    )
      .then((document) =>
        res.status(200).json({
          document,
          success: true,
          message: 'Successfully updated Document!',
        }),
      )
      .catch((err) => res.status(500).send(err));
  },

  // delete document by id
  delete(req, res) {
    // delete only allowed for authorised user of their own documents or admin
    const isPermittedUser =
      req.decoded.role === 'Administrator' || req.decoded._id === req.params.id;

    if (!isPermittedUser) {
      return res.json(403, {
        message: 'Forbidden to delete this document.',
      });
    }

    return Document.findOneAndRemove({ _id: req.params.id })
      .then((document) => res.status(200).json({ message: document }))
      .catch((err) => res.status(500).json({ message: err }));
  },

  // to get the mongo cluster of all the documents filtered by 'User' role
  getAllDocumentsByRoleUser(req, res) {
    const { page, limit } = req.params;

    return Document.find({})
      .populate('ownerId')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort([['dateCreated', 'descending']])
      .then((documents) => {
        const filtered = documents.filter((obj) => obj.ownerId.role === 'User');

        return res.json(filtered);
      })
      .catch((err) => res.send(err));
  },

  // cluster of all the documents filtered by 'Administrator' role
  getAllDocumentsByRoleAdministrator(req, res) {
    const { page, limit } = req.params;

    return Document.find({})
      .populate('ownerId')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort([['dateCreated', 'descending']])
      .then((documents) => {
        const filtered = documents.filter(
          (obj) => obj.ownerId.role === 'Administrator',
        );

        return res.json(filtered);
      })
      .catch((err) => res.send(err));
  },

  // to get the mongo cluster of all the documents filtered by date
  getAllDocumentsByDate(req, res) {
    const { page, limit } = req.params;

    return Document.find({
      dateCreated: {
        $gt: moment().subtract(1, 'day'),
        $lt: moment().add(1, 'day'),
      },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .then((documents) => res.json(documents))
      .catch((err) => res.send(err));
  },

  getAllDocumentsParticularUser(req, res) {
    const id = req.param('id');

    return User.find({ ownerId: id })
      .then((documents) => res.json(documents))
      .catch((err) => res.send(err));
  },
};
