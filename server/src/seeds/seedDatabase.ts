import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '@/models/User';
import Service from '@/models/Service';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/noura-skin-secrets';
    await mongoose.connect(mongoUri);

    console.log('🌱 Starting database seeding...');

    await User.deleteMany({});
    await Service.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'مدير النظام',
      email: 'admin@nouraskin.com',
      phone: '+966501234567',
      password: 'ChangeMe123!',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin user created');

    // Create test user
    const testUser = await User.create({
      name: 'فاطمة أحمد',
      email: 'client@nouraskin.com',
      phone: '+966501234568',
      password: 'Test123!',
      role: 'client',
      skinType: 'دهنية',
      allergies: 'لا توجد',
    });
    console.log('✅ Test user created');

    // Create services
    const services = [
      {
        name: 'تنظيف البشرة العميق',
        description: 'تنظيف عميق للبشرة مع إزالة الرؤوس السوداء والشوائب',
        price: 150,
        duration: 60,
        category: 'تنظيف',
        image: 'https://via.placeholder.com/300x200?text=Deep+Cleaning',
      },
      {
        name: 'حقن الفيتامينات',
        description: 'حقن فيتامينات C للحصول على بشرة مشرقة ومتوهجة',
        price: 250,
        duration: 45,
        category: 'علاجات',
        image: 'https://via.placeholder.com/300x200?text=Vitamin+Injection',
      },
      {
        name: 'تقشير كيميائي',
        description: 'تقشير كيميائي آمن لإزالة الطبقة الخارجية الميتة',
        price: 200,
        duration: 50,
        category: 'تقشير',
        image: 'https://via.placeholder.com/300x200?text=Chemical+Peel',
        discount: 15,
      },
      {
        name: 'حقن الفيلر',
        description: 'حقن الفيلر لملء التجاعيد وتحسين ملامح الوجه',
        price: 500,
        duration: 30,
        category: 'تجميل',
        image: 'https://via.placeholder.com/300x200?text=Filler+Injection',
      },
      {
        name: 'المايكرودرمابريزيون',
        description: 'تقنية حديثة لتجديد شباب البشرة وإزالة الندبات',
        price: 300,
        duration: 60,
        category: 'تجديد',
        image: 'https://via.placeholder.com/300x200?text=Microdermabrasion',
      },
      {
        name: 'تقنية الليزر',
        description: 'إزالة الشعر غير المرغوب باستخدام تقنية الليزر الآمنة',
        price: 350,
        duration: 45,
        category: 'إزالة شعر',
        image: 'https://via.placeholder.com/300x200?text=Laser+Hair+Removal',
      },
    ];

    await Service.insertMany(services);
    console.log(`✅ ${services.length} services created`);

    console.log('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
