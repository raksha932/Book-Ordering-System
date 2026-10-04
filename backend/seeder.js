const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');

dotenv.config();

const sampleBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    price: 19.99,
    stock: 42,
    rating: 4.9,
    reviewsCount: 1420,
    publisher: "Avery / Penguin",
    year: 2018,
    pages: 320,
    isbn: "978-0735211292",
    featured: true,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    description: "An easy and proven way to build good habits and break bad ones. Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits."
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    price: 34.50,
    stock: 18,
    rating: 4.8,
    reviewsCount: 890,
    publisher: "Prentice Hall",
    year: 2008,
    pages: 464,
    isbn: "978-0132350884",
    featured: true,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Clean Code helps developers craft better code and understand the principles of clean craftsmanship."
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Business",
    price: 16.99,
    stock: 29,
    rating: 4.7,
    reviewsCount: 954,
    publisher: "Harriman House",
    year: 2020,
    pages: 256,
    isbn: "978-0857197689",
    featured: true,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people."
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Fiction",
    price: 18.25,
    stock: 12,
    rating: 4.9,
    reviewsCount: 1102,
    publisher: "Ballantine Books",
    year: 2021,
    pages: 496,
    isbn: "978-0593135204",
    featured: true,
    bestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1618609377864-68609b857e90?auto=format&fit=crop&w=600&q=80",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. An unforgettable journey of science fiction and unlikely friendship."
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Technology",
    price: 42.00,
    stock: 8,
    rating: 4.9,
    reviewsCount: 780,
    publisher: "O'Reilly Media",
    year: 2017,
    pages: 616,
    isbn: "978-1449373320",
    featured: false,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    description: "The big ideas behind reliable, scalable, and maintainable systems. Key concepts include distributed data storage, batch processing, stream architectures, and database internals."
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    price: 21.50,
    stock: 15,
    rating: 4.6,
    reviewsCount: 2310,
    publisher: "Harper",
    year: 2015,
    pages: 464,
    isbn: "978-0062316097",
    featured: true,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    description: "From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution that explores the ways in which biology and history have defined us."
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    price: 11.99,
    stock: 35,
    rating: 4.7,
    reviewsCount: 650,
    publisher: "Modern Library",
    year: 2002,
    pages: 256,
    isbn: "978-0812968255",
    featured: false,
    bestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    description: "A series of personal writings by the Roman Emperor recording his private notes to himself and ideas on Stoic philosophy, duty, resilience, and personal virtue."
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Mystery",
    price: 15.40,
    stock: 10,
    rating: 4.5,
    reviewsCount: 1820,
    publisher: "Celadon Books",
    year: 2019,
    pages: 336,
    isbn: "978-1250301696",
    featured: false,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
    description: "Alicia Berenson's life is seemingly perfect. One evening she shoots her husband five times in the face, and then never speaks another word. Theo Faber is a criminal psychotherapist determined to unravel her secret."
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    price: 17.90,
    stock: 19,
    rating: 4.9,
    reviewsCount: 940,
    publisher: "Ballantine Books",
    year: 1980,
    pages: 384,
    isbn: "978-0345539434",
    featured: false,
    bestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    description: "Carl Sagan traces the origins of knowledge and the scientific method, mixing science and philosophy, and speculating to the future of science."
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Business",
    price: 14.80,
    stock: 22,
    rating: 4.6,
    reviewsCount: 880,
    publisher: "Crown Business",
    year: 2014,
    pages: 224,
    isbn: "978-0804139298",
    featured: false,
    bestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    description: "Notes on startups, or how to build the future. Peter Thiel shows how we can find singular ways to create new things and escape competitive commoditization."
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self-Help",
    price: 16.50,
    stock: 14,
    rating: 4.7,
    reviewsCount: 712,
    publisher: "Grand Central Publishing",
    year: 2016,
    pages: 304,
    isbn: "978-1455586691",
    featured: true,
    bestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    description: "Rules for focused success in a distracted world. Deep work is the ability to focus without distraction on a cognitively demanding task, supercharging your productivity."
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    price: 15.20,
    stock: 11,
    rating: 4.8,
    reviewsCount: 1205,
    publisher: "Bantam Books",
    year: 1988,
    pages: 212,
    isbn: "978-0553380163",
    featured: false,
    bestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    description: "Stephen Hawking’s worldwide bestseller explores profound questions about the universe: Where did it begin? What made it possible? Does time always flow forward?"
  }
];

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('Please configure MONGODB_URI in backend/.env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Book.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing Users, Books, and Orders.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@bookstore.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 555-0199'
    });

    // Create Demo Customer
    const demoCustomer = await User.create({
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      password: 'demo123',
      role: 'customer',
      phone: '+1 555-0142'
    });

    console.log('Seeded Users:');
    console.log('  Admin:    admin@bookstore.com / admin123');
    console.log('  Customer: alex.johnson@example.com / demo123');

    // Create Sample Books
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`Seeded ${createdBooks.length} sample books into catalog.`);

    console.log('\nData seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB...');

    await User.deleteMany();
    await Book.deleteMany();
    await Order.deleteMany();

    console.log('All database data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error('Destroy error:', error.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
