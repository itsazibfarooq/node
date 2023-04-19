const express = require('express');
const { getContact, createContact, updateContact, getIdContact, deleteContact } = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

// middleware that will make all routes of contact controller private
router.use(validateToken);
router.route('/').get(getContact).post(createContact);
router.route('/:id').put(updateContact).get(getIdContact).delete(deleteContact);

module.exports = router;