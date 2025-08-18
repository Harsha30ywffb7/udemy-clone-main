const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // Basic course information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    // Course categorization
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "English",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // Media and presentation
    thumbnailUrl: {
      type: String,
      required: true,
    },
    promoVideoUrl: {
      type: String,
      default: null,
    },

    // Pricing and offers
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      validUntil: {
        type: Date,
        default: null,
      },
    },

    // Instructor information
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Course content and objectives
    learningObjectives: [{ type: String }],
    requirements: [{ type: String }],
    targetAudience: [{ type: String }],

    // Course curriculum structure
    sections: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        sortOrder: {
          type: Number,
          default: 0,
        },
        lectures: [
          {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              auto: true,
            },
            title: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              default: "",
            },
            type: {
              type: String,
              enum: [
                "video",
                "article",
                "quiz",
                "assignment",
                "practice_test",
                "coding_exercise",
                "file",
                "audio",
                "presentation",
                "discussion",
                "announcement",
                "external_link",
              ],
              default: "video",
            },
            contentUrl: {
              type: String,
              default: null,
            },
            duration: {
              type: Number, // seconds
              default: 0,
            },
            isPreview: {
              type: Boolean,
              default: false,
            },
            isFree: {
              type: Boolean,
              default: false,
            },
            sortOrder: {
              type: Number,
              default: 0,
            },

            // Video-specific fields
            videoQuality: {
              type: String,
              enum: ["720p", "1080p", "1440p", "4k"],
              default: "720p",
            },
            captions: [
              {
                language: { type: String },
                url: { type: String },
                isAuto: { type: Boolean, default: false },
              },
            ],

            // Article-specific fields
            articleContent: { type: String, default: null },

            // Quiz-specific fields
            quizData: {
              questions: [
                {
                  question: { type: String, required: true },
                  type: {
                    type: String,
                    enum: [
                      "multiple_choice",
                      "true_false",
                      "fill_blank",
                      "matching",
                    ],
                    default: "multiple_choice",
                  },
                  options: [{ type: String }],
                  correctAnswer: { type: String },
                  correctAnswers: [{ type: String }],
                  explanation: { type: String },
                  points: { type: Number, default: 1 },
                },
              ],
              timeLimit: { type: Number, default: null },
              passingScore: { type: Number, default: 70 },
              attemptsAllowed: { type: Number, default: 3 },
            },

            // Assignment-specific fields
            assignmentData: {
              instructions: { type: String },
              submissionType: {
                type: String,
                enum: ["file", "text", "url", "video"],
                default: "file",
              },
              dueDate: { type: Date },
              maxAttempts: { type: Number, default: 1 },
              gradingCriteria: [{ type: String }],
            },

            // Resources and attachments
            resources: [
              {
                title: { type: String, required: true },
                url: { type: String, required: true },
                type: { type: String, default: "file" },
                size: { type: Number },
              },
            ],

            // Analytics
            viewCount: { type: Number, default: 0 },
            completionCount: { type: Number, default: 0 },
            averageTimeSpent: { type: Number, default: 0 },

            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
          },
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // Course statistics
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number, // total seconds
      default: 0,
    },

    // Course status and visibility
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // SEO and metadata
    metaTitle: {
      type: String,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    keywords: [{ type: String }],
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // Course badges and labels
    badges: [
      {
        type: String,
        enum: ["bestseller", "hot", "new", "trending"],
      },
    ],

    // Additional course information
    certificateTemplate: { type: String, default: null },
    completionMessage: { type: String, default: null },
    welcomeMessage: { type: String, default: null },

    // Analytics
    viewCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },

    // Timestamps
    publishedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Virtual for current price
courseSchema.virtual("currentPrice").get(function () {
  if (this.discount.percentage > 0 && this.discount.validUntil > new Date()) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Virtual for discount status
courseSchema.virtual("hasActiveDiscount").get(function () {
  return this.discount.percentage > 0 && this.discount.validUntil > new Date();
});

// Virtual for total sections count
courseSchema.virtual("sectionsCount").get(function () {
  return this.sections.length;
});

// Virtual for total lectures count
courseSchema.virtual("lecturesCount").get(function () {
  return this.sections.reduce(
    (total, section) => total + section.lectures.length,
    0
  );
});

// Virtual for formatted duration
courseSchema.virtual("formattedDuration").get(function () {
  const hours = Math.floor(this.totalDuration / 3600);
  const minutes = Math.floor((this.totalDuration % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  } else {
    return `${hours}h ${minutes}min`;
  }
});

// Indexes for better query performance
courseSchema.index({ instructorId: 1, status: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ status: 1, isActive: 1 });
courseSchema.index({ totalStudents: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ title: "text", subtitle: "text", description: "text" });

// Ensure virtuals are serialized
courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Course", courseSchema);
