// Mock Database & Initial Seed Data for AcademicHub

export const initialData = {
  users: [
    {
      id: "u1",
      name: "Alex Morgan",
      email: "alex@university.edu",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      departmentId: "dep-cs",
      semester: "6th",
      bookmarks: [],
      collections: [
        { id: "col-1", name: "Algorithms Prep", resourceIds: ["res-1", "res-4"] },
        { id: "col-2", name: "Database Exams", resourceIds: ["res-3"] }
      ]
    },
    {
      id: "u2",
      name: "Dr. Robert Chen",
      email: "r.chen@university.edu",
      role: "teacher",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      departmentId: "dep-cs",
      title: "Associate Professor",
      coursesTaught: ["cs-201", "cs-301"]
    },
    {
      id: "u3",
      name: "Sarah Jenkins",
      email: "s.jenkins@university.edu",
      role: "moderator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      departmentId: "dep-ee"
    },
    {
      id: "u4",
      name: "Admin System",
      email: "admin@academichub.edu",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      departmentId: "dep-cs"
    }
  ],

  departments: [
    { id: "dep-cs", name: "Computer Science & Software Eng", code: "CS", icon: "Code", coursesCount: 14, resourcesCount: 84 },
    { id: "dep-ee", name: "Electrical & Computer Eng", code: "ECE", icon: "Zap", coursesCount: 10, resourcesCount: 42 },
    { id: "dep-ds", name: "Data Science & AI", code: "DSAI", icon: "Cpu", coursesCount: 8, resourcesCount: 39 },
    { id: "dep-biz", name: "Business Administration", code: "BA", icon: "TrendingUp", coursesCount: 12, resourcesCount: 51 },
    { id: "dep-math", name: "Mathematics & Statistics", code: "MATH", icon: "Calculator", coursesCount: 9, resourcesCount: 33 }
  ],

  courses: [
    { id: "cs-201", name: "Data Structures & Algorithms", code: "CS201", departmentId: "dep-cs", semester: 3, instructor: "Dr. Robert Chen", resourcesCount: 28 },
    { id: "cs-301", name: "Database Management Systems", code: "CS301", departmentId: "dep-cs", semester: 4, instructor: "Dr. Robert Chen", resourcesCount: 19 },
    { id: "cs-401", name: "Artificial Intelligence & ML", code: "CS401", departmentId: "dep-cs", semester: 7, instructor: "Prof. Elena Vance", resourcesCount: 22 },
    { id: "ece-101", name: "Digital Logic Design", code: "ECE101", departmentId: "dep-ee", semester: 2, instructor: "Dr. Michael Zhang", resourcesCount: 15 },
    { id: "ds-302", name: "Deep Learning & Neural Networks", code: "DS302", departmentId: "dep-ds", semester: 6, instructor: "Dr. Aris Thorne", resourcesCount: 18 }
  ],

  categories: [
    "Lecture Notes", "Past Papers", "Lab Manuals", "Presentations", "Assignments & Solutions", "Textbook & Cheatsheets"
  ],

  tags: [
    "Algorithms", "Trees & Graphs", "SQL", "Relational DB", "PyTorch", "Final Exam", "Midterm", "Verilog", "Python"
  ],

  resources: [
    {
      id: "res-1",
      title: "Data Structures Complete Lecture Notes (Trees, Graphs, Hash Tables)",
      description: "Comprehensive 45-page curated lecture guide covering Binary Search Trees, AVL Trees, Dijkstra Algorithm, and Graph Traversals with C++ / Java code samples.",
      type: "PDF",
      category: "Lecture Notes",
      courseId: "cs-201",
      courseName: "Data Structures & Algorithms",
      departmentId: "dep-cs",
      departmentName: "Computer Science & Software Eng",
      uploaderId: "u2",
      uploaderName: "Dr. Robert Chen",
      uploaderRole: "teacher",
      isOfficial: true,
      status: "approved",
      downloadCount: 342,
      viewCount: 1250,
      rating: 4.9,
      ratingsCount: 48,
      fileSize: "4.8 MB",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      tags: ["Algorithms", "Trees & Graphs"],
      createdAt: "2026-08-15T10:30:00Z",
      reviews: [
        { id: "rev-1", userId: "u1", userName: "Alex Morgan", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", rating: 5, comment: "This helped me ace my Midterm exam! Graphs section is super clear.", date: "2026-08-20" }
      ]
    },
    {
      id: "res-2",
      title: "OOP & Java Design Patterns Midterm Past Paper (Spring 2025)",
      description: "Solved midterm examination paper with detailed marking key, common code pitfalls, and UML diagram solutions.",
      type: "PDF",
      category: "Past Papers",
      courseId: "cs-201",
      courseName: "Data Structures & Algorithms",
      departmentId: "dep-cs",
      departmentName: "Computer Science & Software Eng",
      uploaderId: "u1",
      uploaderName: "Alex Morgan",
      uploaderRole: "student",
      isOfficial: false,
      status: "approved",
      downloadCount: 215,
      viewCount: 890,
      rating: 4.7,
      ratingsCount: 29,
      fileSize: "2.1 MB",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      tags: ["Midterm", "Algorithms"],
      createdAt: "2026-08-10T14:15:00Z",
      reviews: []
    },
    {
      id: "res-3",
      title: "Database Management Systems Lab Manual & SQL Exercises",
      description: "Step-by-step SQL query lab manual covering JOINs, Subqueries, Normalization (1NF to 3NF), and PostgreSQL trigger writing.",
      type: "PDF",
      category: "Lab Manuals",
      courseId: "cs-301",
      courseName: "Database Management Systems",
      departmentId: "dep-cs",
      departmentName: "Computer Science & Software Eng",
      uploaderId: "u2",
      uploaderName: "Dr. Robert Chen",
      uploaderRole: "teacher",
      isOfficial: true,
      status: "approved",
      downloadCount: 189,
      viewCount: 620,
      rating: 4.8,
      ratingsCount: 31,
      fileSize: "3.4 MB",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      tags: ["SQL", "Relational DB"],
      createdAt: "2026-08-01T09:00:00Z",
      reviews: []
    },
    {
      id: "res-4",
      title: "Neural Networks & Backpropagation Visual Cheatsheet",
      description: "High-resolution diagrammatic presentation on Forward Pass, Cross-Entropy Loss, Gradient Descent, and PyTorch tensors.",
      type: "PPTX",
      category: "Presentations",
      courseId: "ds-302",
      courseName: "Deep Learning & Neural Networks",
      departmentId: "dep-ds",
      departmentName: "Data Science & AI",
      uploaderId: "u1",
      uploaderName: "Alex Morgan",
      uploaderRole: "student",
      isOfficial: false,
      status: "approved",
      downloadCount: 142,
      viewCount: 430,
      rating: 4.6,
      ratingsCount: 19,
      fileSize: "12.5 MB",
      fileUrl: "#",
      tags: ["PyTorch", "Python"],
      createdAt: "2026-08-18T16:20:00Z",
      reviews: []
    },
    {
      id: "res-5",
      title: "Digital Logic Design Verilog Code Samples & Circuit Schematics",
      description: "Collection of lab verilog scripts for 4-bit ALUs, Multiplexers, Flip-Flops, and FSM state machines.",
      type: "ZIP",
      category: "Assignments & Solutions",
      courseId: "ece-101",
      courseName: "Digital Logic Design",
      departmentId: "dep-ee",
      departmentName: "Electrical & Computer Eng",
      uploaderId: "u3",
      uploaderName: "Sarah Jenkins",
      uploaderRole: "moderator",
      isOfficial: false,
      status: "approved",
      downloadCount: 98,
      viewCount: 310,
      rating: 4.5,
      ratingsCount: 12,
      fileSize: "1.8 MB",
      fileUrl: "#",
      tags: ["Verilog"],
      createdAt: "2026-08-22T11:00:00Z",
      reviews: []
    },
    {
      id: "res-pending-1",
      title: "Operating Systems Memory Management Notes (Paging & Virtual Memory)",
      description: "Student created summaries on page replacement algorithms (LRU, FIFO, Clock) and page table translation.",
      type: "PDF",
      category: "Lecture Notes",
      courseId: "cs-201",
      courseName: "Data Structures & Algorithms",
      departmentId: "dep-cs",
      departmentName: "Computer Science & Software Eng",
      uploaderId: "u1",
      uploaderName: "Alex Morgan",
      uploaderRole: "student",
      isOfficial: false,
      status: "pending",
      downloadCount: 0,
      viewCount: 15,
      rating: 0,
      ratingsCount: 0,
      fileSize: "3.1 MB",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      tags: ["Midterm"],
      createdAt: "2026-08-30T18:45:00Z",
      reviews: []
    }
  ],

  questions: [
    {
      id: "q-1",
      title: "How to handle AVL Tree double rotation when inserting node into right-left sub-tree?",
      content: "I'm working on Assignment 2 for CS201. Can someone explain why an RL rotation requires a right rotate on the child followed by a left rotate on the parent?",
      courseId: "cs-201",
      courseName: "CS201 - Data Structures",
      authorId: "u-seed-student",
      authorName: "Marcus Vance",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      votes: 14,
      answersCount: 2,
      isSolved: true,
      tags: ["Algorithms", "Trees & Graphs"],
      createdAt: "2026-08-28T14:10:00Z",
      answers: [
        {
          id: "ans-1",
          authorId: "u2",
          authorName: "Dr. Robert Chen",
          authorRole: "teacher",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          content: "Great question! An RL imbalance occurs when a node is inserted into the left subtree of the right child. A single left rotation doesn't balance this because the inner subtree is too heavy. First, we rotate the right child to the right to convert the RL case into an RR case. Then a standard left rotation balances the entire tree root.",
          votes: 18,
          isAccepted: true,
          createdAt: "2026-08-28T15:30:00Z"
        }
      ]
    },
    {
      id: "q-2",
      title: "What is the difference between B-Trees and B+ Trees in Database Indexing?",
      content: "Why do production relational databases like PostgreSQL preference B+ Trees over standard B-Trees for disk indexing?",
      courseId: "cs-301",
      courseName: "CS301 - Database Systems",
      authorId: "u-seed-student-2",
      authorName: "Elena Rostova",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      votes: 9,
      answersCount: 1,
      isSolved: false,
      tags: ["SQL", "Relational DB"],
      createdAt: "2026-08-29T11:20:00Z",
      answers: []
    }
  ],

  studyGroups: [
    {
      id: "grp-1",
      name: "Algorithm Masters & LeetCode Study Circle",
      description: "Weekly collaborative session solving advanced graph algorithms, dynamic programming, and reviewing lecture notes.",
      departmentId: "dep-cs",
      departmentName: "Computer Science",
      membersCount: 42,
      meetingTime: "Tuesdays & Thursdays @ 6 PM",
      location: "Online (Discord & Google Meet)",
      isJoined: false,
      topics: ["Graph Theory", "Dynamic Programming", "Sorting"],
      creatorName: "Dr. Robert Chen",
      creatorRole: "teacher"
    },
    {
      id: "grp-2",
      name: "DBMS Midterm Preparation Group",
      description: "Focused study group working through past exam papers, relational algebra, and SQL query optimizations.",
      departmentId: "dep-cs",
      departmentName: "Computer Science",
      membersCount: 28,
      meetingTime: "Saturdays @ 2 PM",
      location: "Campus Science Block 204",
      isJoined: false,
      topics: ["SQL", "Transactions", "Indexing"],
      creatorName: "Sarah Jenkins",
      creatorRole: "moderator"
    }
  ],

  announcements: [
    {
      id: "ann-1",
      title: "Fall Semester Resource Upload Drive & Recognition Awards",
      content: "Top student resource contributors for the semester will receive academic merit badges and library privileges! Upload verified past papers and structured notes now.",
      author: "AcademicHub Dean's Office",
      date: "2026-08-25",
      pinned: true
    },
    {
      id: "ann-2",
      title: "New AI PDF Summarizer & MCQ Quiz Generator Live",
      content: "Students and teachers can now generate instant 1-click summaries, revision study sheets, and interactive practice quizzes directly from any uploaded resource.",
      author: "AcademicHub Tech Team",
      date: "2026-08-28",
      pinned: true
    }
  ],

  reports: [
    {
      id: "rep-1",
      resourceId: "res-2",
      resourceTitle: "OOP & Java Design Patterns Midterm Past Paper",
      reportedBy: "Student_9021",
      reason: "Page 4 has missing answer key diagrams.",
      status: "pending",
      createdAt: "2026-08-30T10:00:00Z"
    }
  ]
};
