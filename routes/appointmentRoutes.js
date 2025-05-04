
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/', [auth, [
  check('date', 'Date is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
]], appointmentController.createAppointment);

router.get('/', auth, appointmentController.getAppointments);

router.put('/:id', [auth, [
  check('date', 'Date is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
]], appointmentController.updateAppointment);

router.delete('/:id', auth, appointmentController.deleteAppointment);

module.exports = router;