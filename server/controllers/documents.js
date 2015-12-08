 (function() {
   'use strict';
   // get the required models and db connection
   var User = require('../models/users'),
     moment = require('moment'),
     Document = require('../models/documents');

   module.exports = {
     // get document by id
     getDocument: function(req, res) {
       var id = req.param('id');
       Document.find({
         _id: id
       }, function(err, documents) {
         if (err) {
           res.send(err);
           return;
         }
         res.send(documents);
       });
     },
     // to get the mongo cluster of all the documents stored
     getAllDocuments: function(req, res) {
       Document.find({}, function(err, documents) {
         if (err) {
           res.send(err);
           return;
         }
         res.json(documents);
       });
     },
     createDocument: function(req, res) {
       var document = new Document({
         ownerId: req.decoded._id,
         title: req.body.title,
         content: req.body.content
       });
       document.save(function(err) {
         if (err) {
           res.send(err);
           return;
         }
         res.json({
           success: true,
           message: 'Document has been created!'
         });
       });
     },
     // update document by id
     updateDocument: function(req, res) {
       var id = req.param('id');
       Document.findById(req.params.id).exec(function(err, document) {
         if (err) {
           res.status(500).send({
             message: 'There was a problem deleting your document.'
           });
         } else {
           if (document === null) {
             res.send({
               message: 'No document found.'
             });
           } else {
             if (req.decoded._id !== document.ownerId && req.decoded.role === 'User') {
               //send 403 status and forbidden message
               res.status(403).send({
                 message: 'Forbidden to update this document.'
               });
             } else {
               //delete or update
               Document.findOneAndUpdate({
                   _id: id
                 }, {
                   title: req.body.title,
                   content: req.body.content
                 }, {
                   title: req.body.title,
                   content: req.body.content
                 },
                 function(err, documents) {
                   if (err) {
                     res.send(err);
                     return;
                   } else {
                     console.log(documents);
                     res.json({
                       success: true,
                       message: 'Successfully updated Document!'
                     });
                   }
                 });
             }
           }
         }
       });
     },
     // delete document by id
     deleteDocument: function(req, res) {
       var id = req.param('id');
       Document.findById(req.params.id).exec(function(err, document) {
         if (err) {
           res.status(500).send({
             message: 'There was a problem deleting your document.'
           });
         } else {
           if (document === null) {
             res.send({
               message: 'No document found.'
             });
           } else {
             if (req.decoded._id !== document.ownerId && req.decoded.role === 'User') {
               //send 403 status and forbidden message
               res.status(403).send({
                 message: 'Forbidden to delete this document.'
               });
             } else {
               //delete or update
               Document.findOneAndRemove({
                 _id: req.params.id
               }).exec(function(err, documents) {
                 if (err) {
                   return err;
                 } else {
                   res.json(200, {
                     message: documents
                   });
                 }
               });
             }
           }
         }
       });
     },
     // to get the mongo cluster of all the documents filtered by 'User' role
     getAllDocumentsByRoleUser: function(req, res) {
       Document.find({})
         .populate('ownerId')
         .limit(4)
         .sort([
           ['dateCreated', 'descending']
         ])
         .exec(function(err, documents) {
           if (err) {
             res.send(err);
             return;
           }
           var filtered = documents.map(
             function(obj) {
               if (obj.ownerId.role === 'User') {
                 return obj;
               }
             });
           for (var i = 0; i < filtered.length; i++) {
             if (filtered[i] === undefined) {
               filtered.splice(i, 1);
             }
           }
           res.json(filtered);
         });
     },


     // to get the mongo cluster of all the documents filtered by 'Administrator' role
     getAllDocumentsByRoleAdministrator: function(req, res) {
       Document.find({})
         .populate('ownerId')
         .limit(4)
         .sort([
           ['dateCreated', 'descending']
         ])
         .exec(function(err, documents) {
           if (err) {
             res.send(err);
             return;
           }
           var filtered = documents.map(
             function(obj) {
               if (obj.ownerId.role === 'Administrator') {
                 return obj;
               }
             });
           for (var i = 0; i < filtered.length; i++) {
             if (filtered[i] === undefined) {
               filtered.splice(i, 1);
             }
           }
           console.log(filtered);
           res.json(filtered);
         });
     },
     // to get the mongo cluster of all the documents filtered by date
     getAllDocumentsByDate: function(req, res) {
       Document.find({
           dateCreated: {
             $gt: moment().subtract(1, 'day'),
             $lt: moment().add(1, 'day')
           }
         })
         .limit(4)
         .exec(function(err, documents) {
           if (err) {
             res.send(err);
             return;
           }
           res.json(documents);
         });
     }
   };
 })();
