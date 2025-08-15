# Course API Documentation

## Overview

This document describes the comprehensive API structure for the Udemy clone course system. The API is designed to support rich course content with various types of learning materials, similar to Udemy's structure.

## Database Schema

### 1. Course Model (`course.model.js`)

The course model has been enhanced to support comprehensive course content with flexible section structures:

#### Key Features:

- **Rich Content Types**: Supports videos, articles, quizzes, assignments, practice tests, coding exercises, files, audio, presentations, discussions, announcements, and external links
- **Flexible Section Structure**: Each section can contain multiple content items with different types
- **Comprehensive Metadata**: Includes pricing, statistics, categories, labels, and SEO information
- **Curriculum Management**: Detailed curriculum structure with sections and items

#### Content Types Supported:

- `video` - Video lectures with quality options and captions
- `article` - Text-based content with attachments
- `quiz` - Interactive quizzes with multiple question types
- `assignment` - Student assignments with submission requirements
- `practice_test` - Practice tests for skill assessment
- `coding_exercise` - Programming exercises with test cases
- `file` - Downloadable resources
- `audio` - Audio content with transcripts
- `presentation` - Slide presentations
- `discussion` - Discussion forums
- `announcement` - Course announcements
- `external_link` - External resources

### 2. Instructor Model (`instructor.model.js`)

Rich instructor profiles with:

- Professional information and statistics
- Teaching style and expertise
- Social links and achievements
- Verification status
- Analytics and earnings

### 3. Review Model (`review.model.js`)

Comprehensive review system with:

- Rating and review content
- Helpful votes system
- Review categories and status
- Course progress tracking
- Moderation features

### 4. Category Model (`category.model.js`)

Hierarchical category system with:

- Parent-child relationships
- SEO optimization
- Statistics tracking
- Display ordering

## API Endpoints

### Course Data Endpoints

#### 1. Get Course Basic Data

```
GET /api/courses/:id/basic
```

Returns basic course information for sidebar and header display.

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "The Complete Full-Stack Web Development Bootcamp",
    "headline": "Become a Full-Stack Web Developer with just ONE course...",
    "visible_instructors": [{ "title": "Dr. Angela Yu" }],
    "rating": 4.7,
    "total_ratings": 448887,
    "total_students": 1486975,
    "price": 479,
    "originalPrice": 3109,
    "discount": 85,
    "thumbnail": "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    "timeLeft": "1 day left at this price!",
    "subscriptionPrice": 500
  }
}
```

#### 2. Get Course Detailed Data

```
GET /api/courses/:id/detailed
```

Returns detailed course information for main content area.

**Response includes:**

- Course categories and metadata
- Learning objectives and requirements
- Detailed description
- Course labels and tags
- Caption languages

#### 3. Get Course Curriculum

```
GET /api/courses/:id/curriculum
```

Returns the complete course curriculum with sections and content items.

**Response includes:**

- Section structure with titles and descriptions
- Content items with types and metadata
- Preview availability
- Duration and lecture counts
- Content summaries

#### 4. Get Course Instructor

```
GET /api/courses/:id/instructor
```

Returns detailed instructor information.

**Response includes:**

- Instructor profile and statistics
- Bio and teaching style
- Expertise and achievements
- Social links
- Verification status

#### 5. Get Course Reviews

```
GET /api/courses/:id/reviews?page=1&limit=8&rating=4
```

Returns course reviews with pagination and filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Reviews per page (default: 8)
- `rating` - Filter by minimum rating

**Response includes:**

- Overall rating statistics
- Individual reviews with helpful votes
- Pagination information
- Rating breakdown

#### 6. Get Recommended Courses

```
GET /api/courses/:id/recommended?limit=6
```

Returns courses that students also bought.

**Query Parameters:**

- `limit` - Number of courses to return (default: 6)

#### 7. Get Related Topics

```
GET /api/courses/:id/related-topics
```

Returns related topics for the course.

#### 8. Get Course Categories

```
GET /api/courses/:id/categories
```

Returns category breadcrumb information.

#### 9. Get Course Preview Content

```
GET /api/courses/:id/preview/:contentId
```

Returns preview content for videos, articles, etc.

#### 10. Get Course Statistics

```
GET /api/courses/:id/stats
```

Returns course performance statistics.

#### 11. Get Course Pricing

```
GET /api/courses/:id/pricing
```

Returns pricing and offer information.

### Course Management Endpoints

#### 1. Get All Courses

```
GET /api/courses?category=Development&level=Beginner&search=web&sort=rating&page=1&limit=12
```

Returns paginated list of courses with filtering and sorting.

**Query Parameters:**

- `category` - Filter by category
- `level` - Filter by difficulty level
- `search` - Search in title and headline
- `sort` - Sort by: newest, oldest, rating, students, price
- `page` - Page number
- `limit` - Courses per page

#### 2. Create Course (Instructor Only)

```
POST /api/courses
Authorization: Bearer <token>
```

Creates a new course.

**Required Fields:**

- `title` - Course title
- `headline` - Course headline
- `description` - Course description
- `category` - Primary category
- `subcategory` - Subcategory
- `price` - Course price
- `originalPrice` - Original price
- `thumbnail` - Course thumbnail URL

#### 3. Update Course (Instructor Only)

```
PUT /api/courses/:id
Authorization: Bearer <token>
```

Updates an existing course.

#### 4. Delete Course (Instructor Only)

```
DELETE /api/courses/:id
Authorization: Bearer <token>
```

Deletes a course.

#### 5. Get Instructor's Courses

```
GET /api/courses/instructor/my-courses
Authorization: Bearer <token>
```

Returns all courses created by the authenticated instructor.

### Legacy Endpoint

#### Get Course (Complete Data)

```
GET /api/courses/:id
```

Returns all course data in a single response (legacy endpoint for compatibility).

## Content Types in Detail

### Video Content

```json
{
  "content_type": "video",
  "title": "Introduction to HTML",
  "video_url": "https://example.com/video.mp4",
  "video_thumbnail": "https://example.com/thumbnail.jpg",
  "video_quality": "720p",
  "duration": 1800,
  "captions": [
    {
      "language": "English",
      "url": "https://example.com/captions.vtt",
      "is_auto": false
    }
  ],
  "can_be_previewed": true
}
```

### Quiz Content

```json
{
  "content_type": "quiz",
  "title": "HTML Fundamentals Quiz",
  "quiz_data": {
    "questions": [
      {
        "question": "What does HTML stand for?",
        "type": "multiple_choice",
        "options": ["Hyper Text Markup Language", "High Tech Modern Language"],
        "correct_answer": "Hyper Text Markup Language",
        "explanation": "HTML is the standard markup language for creating web pages.",
        "points": 1
      }
    ],
    "time_limit": 30,
    "passing_score": 70,
    "attempts_allowed": 3
  }
}
```

### Assignment Content

```json
{
  "content_type": "assignment",
  "title": "Create a Portfolio Website",
  "assignment_data": {
    "instructions": "Create a personal portfolio website using HTML and CSS...",
    "submission_type": "file",
    "due_date": "2025-02-15T23:59:59Z",
    "max_attempts": 1,
    "grading_criteria": ["Code quality", "Design", "Functionality"],
    "rubric": [
      {
        "criterion": "Code Quality",
        "points": 25,
        "description": "Clean, well-structured code"
      }
    ]
  }
}
```

### Coding Exercise Content

```json
{
  "content_type": "coding_exercise",
  "title": "JavaScript Functions",
  "coding_exercise_data": {
    "problem_statement": "Write a function that calculates the factorial of a number...",
    "starter_code": "function factorial(n) {\n  // Your code here\n}",
    "solution_code": "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
    "test_cases": [
      {
        "input": "5",
        "expected_output": "120",
        "is_hidden": false
      }
    ],
    "programming_language": "javascript",
    "difficulty": "intermediate"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

Protected endpoints require JWT authentication:

```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

API endpoints include simulated delays to mimic real-world conditions:

- Basic data: 300ms
- Detailed data: 400ms
- Curriculum: 350ms
- Instructor: 250ms
- Reviews: 300ms
- Recommended courses: 200ms

## Future Enhancements

1. **Real Database Integration**: Replace dummy data with actual MongoDB queries
2. **File Upload**: Add support for video and file uploads
3. **Real-time Features**: Add WebSocket support for live discussions
4. **Analytics**: Implement detailed course analytics
5. **Search**: Add full-text search capabilities
6. **Caching**: Implement Redis caching for better performance
7. **CDN Integration**: Add CDN support for media files
8. **API Versioning**: Implement API versioning for backward compatibility

## Usage Examples

### Frontend Integration

```javascript
// Get course basic data
const response = await fetch("/api/courses/123/basic");
const courseData = await response.json();

// Get course curriculum
const curriculumResponse = await fetch("/api/courses/123/curriculum");
const curriculum = await curriculumResponse.json();

// Get course reviews with pagination
const reviewsResponse = await fetch("/api/courses/123/reviews?page=1&limit=8");
const reviews = await reviewsResponse.json();
```

### Creating a Course

```javascript
const courseData = {
  title: "Advanced React Development",
  headline: "Master React with advanced patterns and best practices",
  description: "Learn advanced React concepts...",
  category: "Development",
  subcategory: "Web Development",
  price: 299,
  originalPrice: 599,
  thumbnail: "https://example.com/thumbnail.jpg",
};

const response = await fetch("/api/courses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(courseData),
});
```

This comprehensive API structure provides all the functionality needed for a full-featured course platform similar to Udemy, with support for various content types and rich course management features.
