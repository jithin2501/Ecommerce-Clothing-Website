// server/routers/clientManagementRoutes.js

const express = require('express');
const router = express.Router();
const cmCtrl = require('../controllers/clientManagementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', cmCtrl.getStats);
router.post('/migrate', cmCtrl.migrateClients);
router.get('/', cmCtrl.getAllClients);
router.get('/:id', cmCtrl.getClientDetail);

module.exports = router;