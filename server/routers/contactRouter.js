const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  deleteContact,
} = require('../controllers/contactController');

// Public route — frontend contact form submits here
router.post('/', submitContact);

// Admin routes
router.get('/admin', getAllContacts);
router.get('/admin/:id', getContactById);
router.delete('/admin/:id', deleteContact);

module.exports = router;