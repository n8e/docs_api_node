var DocCtrl = require('../controllers/documents'),
  UserCtrl = require('../controllers/users'),
  RolesCtrl = require('../controllers/roles'),
  auth = require('../controllers/auth');

module.exports = function(app, express) {
  var api = express.Router();
  api.post('/users', UserCtrl.createUser);
  api.get('/users', UserCtrl.getAllUsers);
  api.get('/users/roles', RolesCtrl.getRoles);
  api.post('/users/roles', RolesCtrl.createRole);
  api.post('/users/login', UserCtrl.login);
  // middleware
  api.use(auth.authenticate);
  // routes that need checking for a legitimate token
  api.get('/documents', DocCtrl.getAllDocuments);
  api.get('/documents/user', DocCtrl.getAllDocumentsByRoleUser);
  api.get('/documents/admin', DocCtrl.getAllDocumentsByRoleAdministrator);
  api.get('/documents/date', DocCtrl.getAllDocumentsByDate);
  api.get('/users/logout', UserCtrl.logout);
  api.post('/documents', DocCtrl.createDocument);
  api.get('/users/:id/documents', DocCtrl.getAllDocumentsParticularUser);
  api.get('/users/:id', UserCtrl.getUser);
  api.put('/documents/:id', DocCtrl.updateDocument);
  api.put('/users/:id', UserCtrl.updateUser);
  api.delete('/users/:id', UserCtrl.deleteUser);
  api.get('/documents/:id', DocCtrl.getDocument);
  api.delete('/documents/:id', DocCtrl.deleteDocument);
  api.get('/me', function(req, res) {
    res.send(req.decoded);
  });
  return api;
};
