const express = require('express');
const router = express.Router();
const multer = require('multer');
const supportCtrl = require('../controllers/supportController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for video support
});

// User submission
router.post('/submit', upload.array('attachments', 5), supportCtrl.submitSupportIssue);

// Admin routes
router.get('/admin/issues', supportCtrl.getAllIssues);
router.patch('/admin/issues/:id', supportCtrl.updateIssueStatus);

module.exports = router;
