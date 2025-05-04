const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  const { date, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newAppointment = new Appointment({
      user: req.user.id,
      date,
      description,
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateAppointment = async (req, res) => {
  const { date, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    if (appointment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    appointment = await Appointment.findByIdAndUpdate(req.params.id, { date, description }, { new: true });
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    if (appointment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Appointment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};