import Service from '../models/Service.js';
import User from '../models/User.js';

const sampleServices = [
  {
    name: 'Regular House Cleaning',
    description: 'Weekly, bi-weekly, or monthly cleaning to keep your home spotless. Includes dusting, vacuuming, mopping, and bathroom cleaning.',
    price: 80,
    duration: 120,
    category: 'residential',
    isActive: true,
    features: [
      'Dusting all surfaces',
      'Vacuuming carpets and rugs',
      'Mopping hard floors',
      'Kitchen cleaning',
      'Bathroom sanitization',
      'Trash removal'
    ]
  },
  {
    name: 'Deep House Cleaning',
    description: 'Comprehensive cleaning for move-ins, move-outs, or seasonal deep cleans. Includes inside appliances, baseboards, and detailed cleaning.',
    price: 150,
    duration: 240,
    category: 'deep-cleaning',
    isActive: true,
    features: [
      'Inside appliance cleaning',
      'Baseboards and window sills',
      'Light fixture cleaning',
      'Cabinet interior cleaning',
      'Detailed bathroom scrubbing',
      'Carpet deep cleaning'
    ]
  },
  {
    name: 'Office Cleaning',
    description: 'Professional commercial cleaning services for offices and businesses. Flexible scheduling available.',
    price: 120,
    duration: 180,
    category: 'commercial',
    isActive: true,
    features: [
      'Desk and workspace sanitization',
      'Common area cleaning',
      'Restroom maintenance',
      'Floor care',
      'Trash and recycling',
      'Window cleaning'
    ]
  },
  {
    name: 'Post-Construction Cleanup',
    description: 'Specialized cleaning for newly constructed or renovated spaces. Removes construction dust and debris.',
    price: 200,
    duration: 300,
    category: 'deep-cleaning',
    isActive: true,
    features: [
      'Construction dust removal',
      'Debris cleanup',
      'Window and glass cleaning',
      'Floor preparation',
      'Fixture cleaning',
      'Final inspection'
    ]
  },
  {
    name: 'Maintenance Cleaning',
    description: 'Regular maintenance cleaning to keep your space consistently clean. Perfect for busy professionals.',
    price: 60,
    duration: 90,
    category: 'maintenance',
    isActive: true,
    features: [
      'Quick surface cleaning',
      'Bathroom touch-up',
      'Kitchen maintenance',
      'Floor spot cleaning',
      'Trash removal',
      'Basic organization'
    ]
  },
  {
    name: 'Move-In/Move-Out Cleaning',
    description: 'Thorough cleaning for moving situations. Ensures your new home is spotless or your old home is ready for new occupants.',
    price: 180,
    duration: 270,
    category: 'deep-cleaning',
    isActive: true,
    features: [
      'Complete interior cleaning',
      'Appliance cleaning',
      'Cabinet and drawer cleaning',
      'Closet cleaning',
      'Detailed bathroom cleaning',
      'Floor deep cleaning'
    ]
  }
];

const sampleAdmin = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@demo.com',
  password: 'password123',
  phone: '+1234567890',
  address: {
    street: '123 Admin St',
    city: 'Admin City',
    state: 'AC',
    zipCode: '12345'
  },
  role: 'admin'
};

const sampleUser = {
  firstName: 'Demo',
  lastName: 'User',
  email: 'user@demo.com',
  password: 'password123',
  phone: '+1234567891',
  address: {
    street: '456 User Ave',
    city: 'User City',
    state: 'UC',
    zipCode: '54321'
  },
  role: 'user'
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Wait for database connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if services already exist
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      console.log('📝 Creating sample services...');
      await Service.insertMany(sampleServices);
      console.log(`✅ Created ${sampleServices.length} services`);
    } else {
      console.log(`ℹ️  ${existingServices} services already exist, skipping service creation`);
    }

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: sampleAdmin.email });
    if (!existingAdmin) {
      console.log('👤 Creating admin user...');
      await User.create(sampleAdmin);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if demo user exists
    const existingUser = await User.findOne({ email: sampleUser.email });
    if (!existingUser) {
      console.log('👤 Creating demo user...');
      await User.create(sampleUser);
      console.log('✅ Demo user created');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};