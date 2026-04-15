
const express = require('express');
const router = express.Router();
const cmCtrl = require('../controllers/clientManagementController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
router.use(protect, superAdminOnly);

router.get('/stats', cmCtrl.getStats);           // GET  /api/admin/clients/stats
router.post('/migrate', cmCtrl.migrateClients);  // POST /api/admin/clients/migrate
router.get('/', cmCtrl.getAllClients);            // GET  /api/admin/clients
router.get('/:id', cmCtrl.getClientDetail);      // GET  /api/admin/clients/:id

module.exports = router;