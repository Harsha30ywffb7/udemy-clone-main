const courseSections = [
  {
    id: 1,
    title: "Plan your course",
    route: "/course/plan",
    subsections: [
      {
        id: 1,
        title: "Intended learners",
        route: "/course/plan/intended-learners",
        status: "incomplete", // incomplete, complete, current
        isRequired: true,
      },
      {
        id: 2,
        title: "Course structure",
        route: "/course/plan/course-structure",
        status: "complete",
        isRequired: true,
      },
      {
        id: 3,
        title: "Setup & test video",
        route: "/course/plan/setup-test-video",
        status: "complete",
        isRequired: true,
      },
    ],
  },
  {
    id: 2,
    title: "Create your content",
    route: "/course/content",
    subsections: [
      {
        id: 4,
        title: "Film & edit",
        route: "/course/content/film-edit",
        status: "complete",
        isRequired: true,
      },
      {
        id: 5,
        title: "Curriculum",
        route: "/course/content/curriculum",
        status: "incomplete",
        isRequired: true,
      },
      {
        id: 6,
        title: "Captions (optional)",
        route: "/course/content/captions",
        status: "incomplete",
        isRequired: false,
      },
      {
        id: 7,
        title: "Accessibility (optional)",
        route: "/course/content/accessibility",
        status: "complete",
        isRequired: false,
      },
    ],
  },
  {
    id: 3,
    title: "Publish your course",
    route: "/course/publish",
    subsections: [
      {
        id: 8,
        title: "Course landing page",
        route: "/course/publish/landing-page",
        status: "incomplete",
        isRequired: true,
      },
      {
        id: 9,
        title: "Pricing",
        route: "/course/publish/pricing",
        status: "incomplete",
        isRequired: true,
      },
      {
        id: 10,
        title: "Promotions",
        route: "/course/publish/promotions",
        status: "complete",
        isRequired: true,
      },
      {
        id: 11,
        title: "Course messages",
        route: "/course/publish/course-messages",
        status: "incomplete",
        isRequired: true,
      },
    ],
  },
];

// Alternative structure with nested objects for easier navigation
const courseNavigation = {
  planYourCourse: {
    title: "Plan your course",
    route: "/course/plan",
    items: {
      intendedLearners: {
        title: "Intended learners",
        route: "/course/plan/intended-learners",
        status: "current",
        required: true,
      },
      courseStructure: {
        title: "Course structure",
        route: "/course/plan/course-structure",
        status: "complete",
        required: true,
      },
      setupTestVideo: {
        title: "Setup & test video",
        route: "/course/plan/setup-test-video",
        status: "complete",
        required: true,
      },
    },
  },
  createYourContent: {
    title: "Create your content",
    route: "/course/content",
    items: {
      filmEdit: {
        title: "Film & edit",
        route: "/course/content/film-edit",
        status: "complete",
        required: true,
      },
      curriculum: {
        title: "Curriculum",
        route: "/course/content/curriculum",
        status: "incomplete",
        required: true,
      },
      captions: {
        title: "Captions (optional)",
        route: "/course/content/captions",
        status: "incomplete",
        required: false,
      },
      accessibility: {
        title: "Accessibility (optional)",
        route: "/course/content/accessibility",
        status: "complete",
        required: false,
      },
    },
  },
  publishYourCourse: {
    title: "Publish your course",
    route: "/course/publish",
    items: {
      courseLandingPage: {
        title: "Course landing page",
        route: "/course/publish/landing-page",
        status: "incomplete",
        required: true,
      },
      pricing: {
        title: "Pricing",
        route: "/course/publish/pricing",
        status: "incomplete",
        required: true,
      },
      promotions: {
        title: "Promotions",
        route: "/course/publish/promotions",
        status: "complete",
        required: true,
      },
      courseMessages: {
        title: "Course messages",
        route: "/course/publish/course-messages",
        status: "incomplete",
        required: true,
      },
    },
  },
};

// Helper functions for working with the data
const courseHelpers = {
  // Get all incomplete required sections
  getIncompleteRequired: () => {
    return courseSections.flatMap((section) =>
      section.subsections.filter(
        (sub) => sub.status === "incomplete" && sub.isRequired
      )
    );
  },

  // Get completion percentage
  getCompletionPercentage: () => {
    const allSubsections = courseSections.flatMap(
      (section) => section.subsections
    );
    const completed = allSubsections.filter((sub) => sub.status === "complete");
    return Math.round((completed.length / allSubsections.length) * 100);
  },

  // Get current section
  getCurrentSection: () => {
    for (const section of courseSections) {
      const currentSub = section.subsections.find(
        (sub) => sub.status === "current"
      );
      if (currentSub) {
        return { section, subsection: currentSub };
      }
    }
    return null;
  },

  // Check if ready to publish
  isReadyToPublish: () => {
    const requiredSections = courseSections.flatMap((section) =>
      section.subsections.filter((sub) => sub.isRequired)
    );
    return requiredSections.every((sub) => sub.status === "complete");
  },
};

// Export for use in components
export { courseSections, courseNavigation, courseHelpers };
