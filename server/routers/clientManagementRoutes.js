// server/routers/clientManagementRoutes.js

const express = require('express');
const router  = express.Router();
const cmCtrl  = require('../controllers/clientManagementController');

router.get('/stats',    cmCtrl.getStats);           // GET  /api/admin/clients/stats
router.post('/migrate', cmCtrl.migrateClients);     // POST /api/admin/clients/migrate  (one-time cleanup)
router.get('/',         cmCtrl.getAllClients);       // GET  /api/admin/clients
router.get('/:id',      cmCtrl.getClientDetail);    // GET  /api/admin/clients/:id

module.exports = router;