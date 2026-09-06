import { initialData } from '../data/mockDb.js';

let announcements = [...initialData.announcements];
let reports = [...initialData.reports];

export const getAnalytics = (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 1420,
      activeStudents: 1180,
      activeFaculty: 85,
      totalResources: 450,
      totalDownloads: 12480,
      pendingApproval: 1,
      topDepartments: [
        { name: "Computer Science", resources: 184, downloads: 6420 },
        { name: "Electrical Eng", resources: 112, downloads: 2840 },
        { name: "Business Admin", resources: 95, downloads: 1980 },
        { name: "Data Science", resources: 59, downloads: 1240 }
      ],
      weeklyUploadTrend: [
        { day: "Mon", count: 14 },
        { day: "Tue", count: 28 },
        { day: "Wed", count: 35 },
        { day: "Thu", count: 22 },
        { day: "Fri", count: 41 },
        { day: "Sat", count: 18 },
        { day: "Sun", count: 12 }
      ]
    }
  });
};

export const getAnnouncements = (req, res) => {
  res.json({ success: true, data: announcements });
};

export const createAnnouncement = (req, res) => {
  const { title, content, author, pinned } = req.body;
  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    content,
    author: author || "AcademicHub Admin",
    date: new Date().toISOString().split('T')[0],
    pinned: pinned || false
  };
  announcements.unshift(newAnn);
  res.status(201).json({ success: true, data: newAnn });
};

export const getReports = (req, res) => {
  res.json({ success: true, data: reports });
};

export const resolveReport = (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'resolved' or 'dismissed'
  const rep = reports.find(r => r.id === id);
  if (rep) {
    rep.status = action || "resolved";
  }
  res.json({ success: true, data: rep });
};
