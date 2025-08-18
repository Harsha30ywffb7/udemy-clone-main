const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Instructor = require("../models/instructor.model");
const Category = require("../models/category.model");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/udemy-clone"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: "John Student",
    email: "student@example.com",
    password: "password123",
    userType: "student",
    isOnboarded: true,
  },
  {
    name: "Dr. Angela Yu",
    email: "angela@example.com",
    password: "password123",
    userType: "instructor",
    isOnboarded: true,
  },
  {
    name: "Jane Instructor",
    email: "jane@example.com",
    password: "password123",
    userType: "instructor",
    isOnboarded: true,
  },
];

const sampleCategories = [
  {
    name: "Development",
    description: "Software development courses",
    subcategories: ["Web Development", "Mobile Development", "Data Science"],
  },
  {
    name: "Business",
    description: "Business and entrepreneurship courses",
    subcategories: ["Marketing", "Finance", "Management"],
  },
  {
    name: "Design",
    description: "Design and creative courses",
    subcategories: ["Graphic Design", "UI/UX", "3D Animation"],
  },
];

const sampleInstructors = [
  {
    name: "Dr. Angela Yu",
    email: "angela@example.com",
    bio: "Lead instructor at London App Brewery with over 10 years of experience in web development.",
    expertise: ["Web Development", "Python", "JavaScript", "React"],
    rating: 4.8,
    totalStudents: 1500000,
    totalCourses: 7,
    profileImage: "/images/instructors/angela.jpg",
  },
  {
    name: "Jane Instructor",
    email: "jane@example.com",
    bio: "Senior software engineer and passionate educator specializing in full-stack development.",
    expertise: ["Node.js", "MongoDB", "Express", "React"],
    rating: 4.7,
    totalStudents: 85000,
    totalCourses: 3,
    profileImage: "/images/instructors/jane.jpg",
  },
];

const sampleCourses = [
  {
    title: "The Complete Full-Stack Web Development Bootcamp",
    subtitle:
      "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps.",
    description:
      "Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer.",
    category: "Development",
    subcategory: "Web Development",
    price: 479,
    originalPrice: 3109,
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    status: "published",
    level: "All Levels",
    language: "English",
    duration: 3840, // 64 hours in minutes
    enrollmentCount: 1486975,
    viewCount: 2500000,
    rating: 4.7,
    totalRatings: 448887,
    requirements: [
      "No programming experience needed - I'll teach you everything you need to know",
      "A computer with access to the internet",
      "No paid software required",
    ],
    whatYouWillLearn: [
      "Build 16 web development projects for your portfolio",
      "After the course you will be able to build ANY website you want",
      "Work as a freelance web developer",
      "Master backend development with Node",
      "Learn the latest technologies, including Javascript, React, Node and even Web3 development",
    ],
  },
  {
    title: "Complete Python Bootcamp: From Zero to Hero in Python",
    subtitle:
      "Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!",
    description:
      "This is the most comprehensive, yet straight-forward, course for the Python programming language on Udemy!",
    category: "Development",
    subcategory: "Programming Languages",
    price: 499,
    originalPrice: 2199,
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
    status: "published",
    level: "All Levels",
    language: "English",
    duration: 1320, // 22 hours in minutes
    enrollmentCount: 1200000,
    viewCount: 1800000,
    rating: 4.6,
    totalRatings: 425000,
    requirements: [
      "Access to a computer with an internet connection",
      "No prior programming experience required",
    ],
    whatYouWillLearn: [
      "Learn to use Python professionally, learning both Python 2 and Python 3!",
      "Create games with Python, like Tic Tac Toe and Blackjack!",
      "Learn advanced Python features, like the collections module and how to work with timestamps!",
      "Learn to use Object Oriented Programming with classes!",
    ],
  },
  {
    title: "React - The Complete Guide",
    subtitle:
      "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
    description:
      "Master React from the ground up and build amazing React apps!",
    category: "Development",
    subcategory: "Web Development",
    price: 599,
    originalPrice: 2599,
    thumbnailUrl:
      "https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg",
    status: "published",
    level: "All Levels",
    language: "English",
    duration: 2880, // 48 hours in minutes
    enrollmentCount: 890000,
    viewCount: 1400000,
    rating: 4.8,
    totalRatings: 178000,
    requirements: [
      "JavaScript knowledge is required",
      "ES6+ JavaScript features are recommended but not a must-have",
      "NO React knowledge is required",
    ],
    whatYouWillLearn: [
      "Build powerful, fast, user-friendly and reactive web apps",
      "Provide amazing user experiences by leveraging the power of JavaScript with ease",
      "Apply for high-paid jobs or work as a freelancer in one the most-demanded sectors you can find in web dev right now",
      "Learn all about React Hooks and React Components",
    ],
  },
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Instructor.deleteMany({});
    await Category.deleteMany({});

    // Create users with hashed passwords
    console.log("Creating users...");
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create categories
    console.log("Creating categories...");
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create instructors
    console.log("Creating instructors...");
    const instructorsWithIds = sampleInstructors.map((instructor, index) => ({
      ...instructor,
      userId: createdUsers.find((user) => user.email === instructor.email)._id,
    }));
    const createdInstructors = await Instructor.insertMany(instructorsWithIds);
    console.log(`Created ${createdInstructors.length} instructors`);

    // Create courses
    console.log("Creating courses...");
    const coursesWithInstructors = sampleCourses.map((course, index) => ({
      ...course,
      instructorId: createdUsers.find((user) => user.userType === "instructor")
        ._id,
    }));
    const createdCourses = await Course.insertMany(coursesWithInstructors);
    console.log(`Created ${createdCourses.length} courses`);

    console.log("Seed data created successfully!");
    console.log("\nSample login credentials:");
    console.log("Student: student@example.com / password123");
    console.log("Instructor: angela@example.com / password123");
    console.log("Instructor: jane@example.com / password123");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
const runSeed = async () => {
  await connectDB();
  await seedData();
};

// Check if script is being run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData, connectDB };
