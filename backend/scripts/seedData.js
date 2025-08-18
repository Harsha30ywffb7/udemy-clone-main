const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Wishlist = require("../models/wishlist.model");

// Mock data from frontend
const mockCourses = [
  {
    title: "Complete Linux Training Course to Get Your Dream IT Job 2022",
    subtitle: "Master Linux system administration and command line",
    description:
      "Learn Linux from scratch and become a Linux system administrator. This comprehensive course covers everything you need to know about Linux.",
    category: "IT & Software",
    subcategory: "Operating Systems",
    language: "English",
    level: "Beginner",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/course0.jpg",
    instructor: "Imran Afzal",
    rateScore: 4.6,
    reviewerNum: "128,636",
    mark: "Bestseller",
  },
  {
    title: "The Complete JavaScript Course 2022: From Zero to Expert",
    subtitle:
      "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory.",
    description:
      "Learn modern JavaScript from scratch! This is the most complete JavaScript course on Udemy. It's an all-in-one package that will take you from the very fundamentals of JavaScript, all the way to building modern and complex applications.",
    category: "Development",
    subcategory: "Web Development",
    language: "English",
    level: "Intermediate",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/course1.jpg",
    instructor: "Jonas Schemedtmann",
    rateScore: 4.7,
    reviewerNum: "128,636",
    mark: "Bestseller",
  },
  {
    title: "Microsoft Excel - Excel from Beginner to Advanced",
    subtitle:
      "Excel with this A-Z Microsoft Excel Course. Microsoft Excel 2010, 2013, 2016, Excel 2019 and Office 365",
    description:
      "Learn Microsoft Excel from Beginner Level to Advanced Level. This Excel course is for anyone who wants to be more efficient and productive with Microsoft Excel.",
    category: "Business",
    subcategory: "Productivity",
    language: "English",
    level: "Advanced",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/course2.jpg",
    instructor: "Kyle Pew, Office Newb",
    rateScore: 4.0,
    reviewerNum: "285,191",
  },
  {
    title: "The Complete Digital Marketing Course - 12 Courses in 1",
    subtitle:
      "Digital Marketing Course 2022: SEO, YouTube, Email, Facebook, Analytics, AdWords, AdSense, ClickFunnels",
    description:
      "Learn Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
    category: "Marketing",
    subcategory: "Digital Marketing",
    language: "English",
    level: "Intermediate",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/course3.jpg",
    instructor: "Rob Percival, Daraph Walsh, Codestars by Rob Percival",
    rateScore: 4.5,
    reviewerNum: "154,729",
    mark: "Bestseller",
  },
  {
    title: "Learn Ethical Hacking From Scratch",
    subtitle:
      "Become an ethical hacker that can hack computer systems like black hat hackers and secure them like security experts.",
    description:
      "This course is highly practical but it won't neglect the theory; we'll start with the basics of ethical hacking, break down the different penetration testing phases, and then dive into hacking systems step by step.",
    category: "IT & Software",
    subcategory: "Network & Security",
    language: "English",
    level: "Beginner",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/course4.jpg",
    instructor: "Zaid Sabih, z Security",
    rateScore: 4.6,
    reviewerNum: "102,409",
    mark: "Bestseller",
  },
  {
    title: "The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert",
    subtitle:
      "Become a MySQL expert with this comprehensive course. Learn to create databases, write complex queries, and optimize performance.",
    description:
      "A comprehensive MySQL course! This course will teach you everything you need to know about MySQL and SQL. We'll start with the basics and work our way up to more advanced topics like triggers, views, and stored procedures.",
    category: "Development",
    subcategory: "Database Design & Development",
    language: "English",
    level: "Advanced",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/course5.jpg",
    instructor: "Colt Steele, lan Schoononver",
    rateScore: 4.6,
    reviewerNum: "64,376",
    mark: "Bestseller",
  },
  {
    title: "Learning Python for Data Analysis and Visualization",
    subtitle:
      "Learn Python for data analysis and visualization with Pandas, Matplotlib, Seaborn, and more",
    description:
      "Learn Python for data analysis and visualization. This course will teach you how to use Python libraries like Pandas, Matplotlib, and Seaborn for data analysis and visualization.",
    category: "Development",
    subcategory: "Programming Languages",
    language: "English",
    level: "Beginner",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/python1.jpg",
    instructor: "Jose Portilla",
    rateScore: 4.7,
    reviewerNum: "12,345",
  },
  {
    title: "Python for Beginners - Learn Programming from scratch",
    subtitle:
      "Learn Python programming from scratch with hands-on exercises and projects",
    description:
      "This Python course is designed for beginners who want to learn Python programming from scratch. You'll learn Python syntax, data structures, functions, and more.",
    category: "Development",
    subcategory: "Programming Languages",
    language: "English",
    level: "Beginner",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/python2.jpg",
    instructor: "Edwin Diaz, Coding Faculty Solutions",
    rateScore: 4.6,
    reviewerNum: "122,345",
  },
  {
    title: "Javascript for Beginners",
    subtitle:
      "Learn JavaScript programming from the ground up with practical examples",
    description:
      "Learn JavaScript from scratch! This course covers all the fundamentals of JavaScript programming with hands-on examples and projects.",
    category: "Development",
    subcategory: "Web Development",
    language: "English",
    level: "Beginner",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/js1.jpg",
    instructor: "Framework Tech Media",
    rateScore: 4.7,
    reviewerNum: "12,345",
  },
  {
    title: "Ultimate AWS Certified Solutions Architect Associate 2022",
    subtitle:
      "Pass the AWS Certified Solutions Architect Associate Certification SAA-C02. Complete Amazon Web Services Cloud tutorial!",
    description:
      "Welcome to the most comprehensive and up-to-date course to pass the AWS Certified Solutions Architect Associate exam. This course is perfectly aligned with the latest exam.",
    category: "IT & Software",
    subcategory: "Cloud Computing",
    language: "English",
    level: "Intermediate",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/aws1.jpg",
    instructor: "Stephane Maarek",
    rateScore: 3.5,
    reviewerNum: "261",
  },
];

const mockCategories = [
  { title: "Development", slug: "development", level: 1 },
  { title: "Business", slug: "business", level: 1 },
  { title: "IT & Software", slug: "it-software", level: 1 },
  { title: "Marketing", slug: "marketing", level: 1 },
  { title: "Design", slug: "design", level: 1 },
  { title: "Photography", slug: "photography", level: 1 },
  { title: "Music", slug: "music", level: 1 },
  { title: "Health & Fitness", slug: "health-fitness", level: 1 },
  { title: "Teaching & Academics", slug: "teaching-academics", level: 1 },
  { title: "Lifestyle", slug: "lifestyle", level: 1 },
];

const mockUsers = [
  {
    name: { first: "Imran", last: "Afzal" },
    email: "imran.afzal@example.com",
    role: "instructor",
    bio: "Linux and DevOps expert with over 10 years of experience",
  },
  {
    name: { first: "Jonas", last: "Schemedtmann" },
    email: "jonas.schemedtmann@example.com",
    role: "instructor",
    bio: "Full-stack web developer and instructor",
  },
  {
    name: { first: "Kyle", last: "Pew" },
    email: "kyle.pew@example.com",
    role: "instructor",
    bio: "Microsoft Office expert and trainer",
  },
  {
    name: { first: "Rob", last: "Percival" },
    email: "rob.percival@example.com",
    role: "instructor",
    bio: "Digital marketing expert and entrepreneur",
  },
  {
    name: { first: "Zaid", last: "Sabih" },
    email: "zaid.sabih@example.com",
    role: "instructor",
    bio: "Ethical hacking and cybersecurity expert",
  },
  {
    name: { first: "Colt", last: "Steele" },
    email: "colt.steele@example.com",
    role: "instructor",
    bio: "Full-stack developer and coding bootcamp instructor",
  },
  {
    name: { first: "Jose", last: "Portilla" },
    email: "jose.portilla@example.com",
    role: "instructor",
    bio: "Data scientist and Python expert",
  },
  {
    name: { first: "Edwin", last: "Diaz" },
    email: "edwin.diaz@example.com",
    role: "instructor",
    bio: "Web developer and programming instructor",
  },
  {
    name: { first: "Stephane", last: "Maarek" },
    email: "stephane.maarek@example.com",
    role: "instructor",
    bio: "AWS certified solutions architect and cloud expert",
  },
  {
    name: { first: "John", last: "Doe" },
    email: "john.doe@example.com",
    role: "student",
    bio: "Aspiring web developer",
  },
  {
    name: { first: "Jane", last: "Smith" },
    email: "jane.smith@example.com",
    role: "student",
    bio: "Data science enthusiast",
  },
];

async function connectDB() {
  try {
    require("dotenv").config();
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/udemy-clone"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await Course.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Wishlist.deleteMany({});
    console.log("Database cleared");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}

async function seedCategories() {
  try {
    const categories = await Category.insertMany(mockCategories);
    console.log("Categories seeded:", categories.length);
    return categories;
  } catch (error) {
    console.error("Error seeding categories:", error);
    return [];
  }
}

async function seedUsers() {
  try {
    const usersWithHashedPasswords = await Promise.all(
      mockUsers.map(async (user) => ({
        ...user,
        passwordHash: await bcrypt.hash("password123", 10),
        isEmailVerified: true,
        isActive: true,
      }))
    );

    const users = await User.insertMany(usersWithHashedPasswords);
    console.log("Users seeded:", users.length);
    return users;
  } catch (error) {
    console.error("Error seeding users:", error);
    return [];
  }
}

async function seedCourses(users) {
  try {
    const instructors = users.filter((user) => user.role === "instructor");

    const coursesWithInstructors = mockCourses.map((course, index) => {
      const instructor = instructors[index % instructors.length];

      return {
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        category: course.category,
        subcategory: course.subcategory,
        language: course.language,
        level: course.level,
        thumbnailUrl: course.thumbnailUrl,
        isFree: true,
        instructorId: instructor._id,
        learningObjectives: [
          "Master the fundamentals",
          "Build real-world projects",
          "Understand best practices",
          "Prepare for career opportunities",
        ],
        requirements: [
          "Basic computer skills",
          "Internet connection",
          "Willingness to learn",
        ],
        targetAudience: [
          "Beginners",
          "Students",
          "Professionals looking to upskill",
        ],
        sections: [
          {
            title: "Introduction",
            lectures: [
              {
                title: "Welcome to the course",
                type: "video",
                duration: 300,
                isPreview: true,
              },
              {
                title: "Course overview",
                type: "video",
                duration: 600,
                isPreview: false,
              },
            ],
          },
          {
            title: "Getting Started",
            lectures: [
              {
                title: "Setting up your environment",
                type: "video",
                duration: 900,
                isPreview: false,
              },
              {
                title: "Your first project",
                type: "video",
                duration: 1200,
                isPreview: false,
              },
            ],
          },
        ],
        status: "published",
        averageRating: course.rateScore,
        totalRatings: parseInt(course.reviewerNum?.replace(/,/g, "") || "0"),
        enrollmentCount: Math.floor(Math.random() * 10000) + 1000,
        viewCount: Math.floor(Math.random() * 50000) + 5000,
        totalDuration: 3600 + Math.floor(Math.random() * 36000), // 1-11 hours
        totalLectures: 10 + Math.floor(Math.random() * 40), // 10-50 lectures
        isFeatured: course.mark === "Bestseller",
        tags: ["popular", "trending"],
      };
    });

    const courses = await Course.insertMany(coursesWithInstructors);
    console.log("Courses seeded:", courses.length);
    return courses;
  } catch (error) {
    console.error("Error seeding courses:", error);
    return [];
  }
}

async function seedWishlists(users, courses) {
  try {
    const students = users.filter((user) => user.role === "student");
    const wishlists = [];

    for (const student of students) {
      // Add 2-5 random courses to each student's wishlist
      const numberOfCourses = Math.floor(Math.random() * 4) + 2;
      const randomCourses = courses
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfCourses);

      const wishlistCourses = randomCourses.map((course) => ({
        courseId: course._id,
        addedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Random date within last 30 days
        courseSnapshot: {
          title: course.title,
          subtitle: course.subtitle,
          thumbnailUrl: course.thumbnailUrl,
          price: 0,
          originalPrice: 0,
          instructorName: "Instructor Name", // Will be populated later with real instructor name
          averageRating: course.averageRating,
          totalStudents: course.enrollmentCount,
        },
      }));

      wishlists.push({
        userId: student._id,
        courses: wishlistCourses,
        name: "My Wishlist",
        isPublic: false,
      });
    }

    const createdWishlists = await Wishlist.insertMany(wishlists);
    console.log("Wishlists seeded:", createdWishlists.length);
    return createdWishlists;
  } catch (error) {
    console.error("Error seeding wishlists:", error);
    return [];
  }
}

async function updateCourseInstructorNames(courses, users) {
  try {
    for (const course of courses) {
      const instructor = users.find((user) =>
        user._id.equals(course.instructorId)
      );
      if (instructor) {
        // Update any wishlists that contain this course
        await Wishlist.updateMany(
          { "courses.courseId": course._id },
          {
            $set: {
              "courses.$.courseSnapshot.instructorName": `${instructor.name.first} ${instructor.name.last}`,
            },
          }
        );
      }
    }
    console.log("Updated instructor names in wishlists");
  } catch (error) {
    console.error("Error updating instructor names:", error);
  }
}

async function seedDatabase() {
  console.log("Starting database seeding...");

  await connectDB();
  await clearDatabase();

  const categories = await seedCategories();
  const users = await seedUsers();
  const courses = await seedCourses(users);
  const wishlists = await seedWishlists(users, courses);

  await updateCourseInstructorNames(courses, users);

  console.log("Database seeding completed!");
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${users.length} users`);
  console.log(`Created ${courses.length} courses`);
  console.log(`Created ${wishlists.length} wishlists`);

  await mongoose.connection.close();
}

// Run the seeding script
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };
