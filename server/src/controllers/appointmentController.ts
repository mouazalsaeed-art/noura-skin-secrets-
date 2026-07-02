import { Response } from 'express';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { AuthRequest } from '@/middleware/auth';

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('serviceId')
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, serviceName, date, time, notes, price } = req.body;

    const appointment = new Appointment({
      userId: req.userId,
      serviceId,
      serviceName,
      date,
      time,
      notes,
      price,
      status: 'pending',
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { date, time, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, time, notes },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error });
  }
};

export const confirmAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment confirmed successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming appointment', error });
  }
};

export const completeAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    await appointment.save();

    const user = await User.findById(req.userId);
    if (user) {
      user.totalSpent += appointment.price;
      await user.save();
    }

    res.status(200).json({
      message: 'Appointment completed successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing appointment', error });
  }
};
