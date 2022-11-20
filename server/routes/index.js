const DocCtrl = require('../controllers/documents');
const UserCtrl = require('../controllers/users');
const auth = require('../controllers/auth');

module.exports = (app, express) => {
  const api = express.Router();

  api.post('/users', UserCtrl.create);
  api.get('/users', UserCtrl.getAll);
  api.post('/users/login', UserCtrl.login);
  // middleware
  api.use(auth.authenticate);
  // routes that need checking for a legitimate token
  api.get('/documents', DocCtrl.getAll);
  api.get('/documents/user', DocCtrl.getAllDocumentsByRoleUser);
  api.get('/documents/admin', DocCtrl.getAllDocumentsByRoleAdministrator);
  api.get('/documents/date', DocCtrl.getAllDocumentsByDate);
  api.get('/users/logout', UserCtrl.logout);
  api.post('/documents', DocCtrl.create);
  api.get('/users/:id/documents', DocCtrl.getAllDocumentsParticularUser);
  api.get('/users/:id', UserCtrl.get);
  api.put('/documents/:id', DocCtrl.update);
  api.put('/users/:id', UserCtrl.update);
  api.delete('/users/:id', UserCtrl.delete);
  api.get('/documents/:id', DocCtrl.get);
  api.delete('/documents/:id', DocCtrl.delete);
  api.get('/me', (req, res) => {
    res.send(req.decoded);
  });

  return api;
};
