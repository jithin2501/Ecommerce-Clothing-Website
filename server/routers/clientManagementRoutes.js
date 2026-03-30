// server/routers/clientManagementRoutes.js
// New route file — no naming conflict with existing routers.

const express   = require('express');
const router    = express.Router();
const cmCtrl    = require('../controllers/clientManagementController');

// NOTE: Add your existing authMiddleware here if admin routes are protected
// const { protect } = require('../middleware/authMiddleware');
// router.use(protect);

router.get('/stats',    cmCtrl.getStats);        // GET /api/admin/clients/stats
router.get('/',         cmCtrl.getAllClients);    // GET /api/admin/clients
router.get('/:id',      cmCtrl.getClientDetail); // GET /api/admin/clients/:id

module.exports = router;