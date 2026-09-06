import { initialData } from '../data/mockDb.js';

let resources = [...initialData.resources];

/**
 * Per-user bookmarks store: Map<userId, Set<resourceId>>
 * Seeded with demo users' existing bookmarks.
 * New users start with an empty set automatically.
 */
const userBookmarks = new Map();

/** Get or create a bookmark set for a user */
const getBookmarkSet = (userId) => {
  if (!userBookmarks.has(userId)) {
    userBookmarks.set(userId, new Set());
  }
  return userBookmarks.get(userId);
};

let collections = [...initialData.users[0].collections];

export const getResources = (req, res) => {
  const { search, department, course, category, tag, status, role } = req.query;
  
  let result = [...resources];

  // Filter by status: normal users only see approved; moderators/admins can filter by pending
  if (status) {
    result = result.filter(r => r.status === status);
  } else if (role !== 'moderator' && role !== 'admin') {
    result = result.filter(r => r.status === 'approved');
  }

  if (department) {
    result = result.filter(r => r.departmentId === department);
  }

  if (course) {
    result = result.filter(r => r.courseId === course);
  }

  if (category) {
    result = result.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    result = result.filter(r => r.tags && r.tags.includes(tag));
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.courseName.toLowerCase().includes(q) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  res.json({ success: true, count: result.length, data: result });
};

export const getResourceById = (req, res) => {
  const resource = resources.find(r => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, message: "Resource not found" });
  }
  // increment view count
  resource.viewCount = (resource.viewCount || 0) + 1;
  res.json({ success: true, data: resource });
};

export const createResource = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to upload resources.'
    });
  }

  // Super Admin check
  const isSuperAdmin = Boolean(
    user.isSuperAdmin ||
    user.username === 'awaisdemo123' ||
    (user.email && user.email.toLowerCase() === 'criminalmostwanted517@gmail.com') ||
    (user.email && user.email.toLowerCase() === (process.env.SMTP_USER || '').toLowerCase())
  );

  // 1. Students are strictly VIEW-ONLY on website
  if (user.role === 'student') {
    return res.status(403).json({
      success: false,
      message: 'Students have view-only access. Content uploading is restricted to approved Moderators, Admins, and Super Admin.'
    });
  }

  // 2. Moderator and Admin require Super Admin approval (status must be 'active')
  if (user.role === 'moderator' || user.role === 'admin') {
    if (!isSuperAdmin && (user.status === 'pending_approval' || user.isApproved === false)) {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Your privileged account requires Super Admin approval before you can upload resources.'
      });
    }
  } else if (!isSuperAdmin && user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to upload content.'
    });
  }

  const { title, description, type, category, courseId, courseName, departmentId, departmentName, tags, isOfficial } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Resource title is required.' });
  }

  const isOfficialContent = isSuperAdmin || user.role === 'admin' || user.role === 'teacher' || isOfficial === true;

  const newResource = {
    id: `res-${Date.now()}`,
    title: title.trim(),
    description: description || "No description provided.",
    type: type || "PDF",
    category: category || "Lecture Notes",
    courseId: courseId || "cs-201",
    courseName: courseName || "Data Structures & Algorithms",
    departmentId: departmentId || "dep-cs",
    departmentName: departmentName || "Computer Science & Software Eng",
    uploaderId: user.id || "u-staff",
    uploaderName: user.name || "Academic Staff",
    uploaderRole: user.role,
    isOfficial: isOfficialContent,
    status: "approved", // Approved staff / moderators / superadmin resources publish directly to catalog
    downloadCount: 0,
    viewCount: 1,
    rating: 5.0,
    ratingsCount: 1,
    fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : "2.4 MB",
    fileUrl: req.file ? `/uploads/${req.file.filename}` : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : ["Study Material"],
    createdAt: new Date().toISOString(),
    reviews: []
  };

  resources.unshift(newResource);
  res.status(201).json({
    success: true,
    message: "Resource published successfully to the catalog!",
    data: newResource
  });
};

export const updateResourceStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  const resource = resources.find(r => r.id === id);
  if (!resource) {
    return res.status(404).json({ success: false, message: "Resource not found" });
  }

  resource.status = status;
  res.json({ success: true, message: `Resource status updated to ${status}`, data: resource });
};

export const addReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment, userName } = req.body;

  const resource = resources.find(r => r.id === id);
  if (!resource) {
    return res.status(404).json({ success: false, message: "Resource not found" });
  }

  const review = {
    id: `rev-${Date.now()}`,
    userId: "u1",
    userName: userName || "Alex Morgan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: Number(rating) || 5,
    comment: comment || "Great resource!",
    date: new Date().toISOString().split('T')[0]
  };

  resource.reviews = resource.reviews || [];
  resource.reviews.unshift(review);

  // Recalculate average rating
  const total = resource.reviews.reduce((acc, r) => acc + r.rating, 0);
  resource.ratingsCount = resource.reviews.length;
  resource.rating = Number((total / resource.ratingsCount).toFixed(1));

  res.json({ success: true, message: "Review added successfully", data: resource });
};

export const toggleBookmark = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 'anonymous';
  const bookmarkSet = getBookmarkSet(userId);

  let isBookmarked = false;
  if (bookmarkSet.has(id)) {
    bookmarkSet.delete(id);
  } else {
    bookmarkSet.add(id);
    isBookmarked = true;
  }

  const bookmarksArray = [...bookmarkSet];
  res.json({ success: true, isBookmarked, bookmarks: bookmarksArray });
};

export const getBookmarks = (req, res) => {
  const userId = req.user?.id || 'anonymous';
  const bookmarkSet = getBookmarkSet(userId);
  const bookmarkedResources = resources.filter((r) => bookmarkSet.has(r.id));
  res.json({ success: true, data: bookmarkedResources });
};

export const getCollections = (req, res) => {
  res.json({ success: true, data: collections });
};

export const createCollection = (req, res) => {
  const { name, resourceId } = req.body;
  const newCol = {
    id: `col-${Date.now()}`,
    name: name || "New Collection",
    resourceIds: resourceId ? [resourceId] : []
  };
  collections.push(newCol);
  res.status(201).json({ success: true, data: newCol });
};

export const incrementDownload = (req, res) => {
  const resource = resources.find(r => r.id === req.params.id);
  if (resource) {
    resource.downloadCount = (resource.downloadCount || 0) + 1;
  }
  res.json({ success: true, downloadCount: resource ? resource.downloadCount : 0 });
};
