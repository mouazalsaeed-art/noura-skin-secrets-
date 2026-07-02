import { Response } from 'express';
import Stripe from 'stripe';
import Appointment from '@/models/Appointment';
import { AuthRequest } from '@/middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointment.price * 100),
      currency: 'usd',
      metadata: {
        appointmentId: appointmentId,
        userId: req.userId,
      },
    });

    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentIntentId: paymentIntent.id,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const appointment = await Appointment.findOneAndUpdate(
        { paymentIntentId },
        { paymentStatus: 'paid', status: 'confirmed' },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        appointment,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Payment not completed',
      status: paymentIntent.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error });
  }
};

export const refundPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    const appointment = await Appointment.findOneAndUpdate(
      { paymentIntentId },
      { paymentStatus: 'refunded' },
      { new: true }
    );

    res.status(200).json({
      message: 'Refund processed successfully',
      refund,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing refund', error });
  }
};
