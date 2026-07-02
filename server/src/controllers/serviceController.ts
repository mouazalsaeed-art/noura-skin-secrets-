import { Response } from 'express';
import Service from '@/models/Service';
import { AuthRequest } from '@/middleware/auth';

export const getAllServices = async (req: AuthRequest, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

export const getServiceById = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
};

export const searchServices = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    const services = await Service.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error searching services', error });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, duration, category, image, discount } =
      req.body;

    const service = new Service({
      name,
      description,
      price,
      duration,
      category,
      image,
      discount,
    });

    await service.save();
    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, duration, category, image, discount } =
      req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration, category, image, discount },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
};
