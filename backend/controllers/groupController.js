import { initialData } from '../data/mockDb.js';

let studyGroups = initialData.studyGroups.map(g => ({
  ...g,
  isJoined: false // all study groups start unjoined for new users
}));

// Per-user joined study groups: Map<userId, Set<groupId>>
const userGroups = new Map();

const getUserJoinedSet = (userId) => {
  if (!userGroups.has(userId)) {
    userGroups.set(userId, new Set());
  }
  return userGroups.get(userId);
};

export const getStudyGroups = (req, res) => {
  const userId = req.user?.id || 'anonymous';
  const joinedSet = getUserJoinedSet(userId);

  const localizedGroups = studyGroups.map(g => ({
    ...g,
    isJoined: joinedSet.has(g.id)
  }));

  res.json({ success: true, data: localizedGroups });
};

export const joinStudyGroup = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 'anonymous';
  const joinedSet = getUserJoinedSet(userId);

  const group = studyGroups.find(g => g.id === id);
  if (!group) {
    return res.status(404).json({ success: false, message: "Study group not found" });
  }

  let isJoined = false;
  if (joinedSet.has(id)) {
    joinedSet.delete(id);
    group.membersCount = Math.max(0, (group.membersCount || 1) - 1);
    isJoined = false;
  } else {
    joinedSet.add(id);
    group.membersCount = (group.membersCount || 0) + 1;
    isJoined = true;
  }

  res.json({
    success: true,
    data: {
      ...group,
      isJoined
    }
  });
};

export const createStudyGroup = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to create a study group.'
    });
  }

  const isSuperAdmin = Boolean(
    user.isSuperAdmin ||
    user.username === 'awaisdemo123' ||
    (user.email && user.email.toLowerCase() === 'criminalmostwanted517@gmail.com') ||
    (user.email && user.email.toLowerCase() === (process.env.SMTP_USER || '').toLowerCase())
  );

  const allowedRoles = ['admin', 'teacher', 'moderator'];
  const hasAllowedRole = allowedRoles.includes(user.role);

  if (!isSuperAdmin && !hasAllowedRole) {
    return res.status(403).json({
      success: false,
      message: 'Access restricted: Only Admin, Super Admin, Teacher, and Moderator accounts can create study groups.'
    });
  }

  // Moderator and Admin pending approval check if applicable
  if ((user.role === 'moderator' || user.role === 'admin') && !isSuperAdmin) {
    if (user.status === 'pending_approval' || user.isApproved === false) {
      return res.status(403).json({
        success: false,
        message: 'Your privileged account requires Super Admin approval before you can create study groups.'
      });
    }
  }

  const { name, description, meetingTime, topics, departmentId, departmentName, location } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Study group name is required.' });
  }

  let formattedTopics = ['General Study'];
  if (Array.isArray(topics)) {
    formattedTopics = topics.map(t => String(t).trim()).filter(Boolean);
  } else if (typeof topics === 'string' && topics.trim()) {
    formattedTopics = topics.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
  }

  if (formattedTopics.length === 0) {
    formattedTopics = ['General Study'];
  }

  let roleLabel = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Faculty Moderator';
  if (isSuperAdmin) roleLabel = 'Super Admin';

  const newGroupId = `grp-${Date.now()}`;
  const newGroup = {
    id: newGroupId,
    name: name.trim(),
    description: description ? description.trim() : 'Collaborative peer study and exam review group.',
    departmentId: departmentId || 'dep-cs',
    departmentName: departmentName || 'Computer Science',
    membersCount: 1,
    meetingTime: meetingTime && meetingTime.trim() ? meetingTime.trim() : 'Flexible schedule',
    location: location && location.trim() ? location.trim() : 'Online / Campus Lounge',
    topics: formattedTopics,
    creatorId: user.id,
    creatorName: user.name || roleLabel,
    creatorRole: isSuperAdmin ? 'superadmin' : user.role,
    createdAt: new Date().toISOString()
  };

  studyGroups.unshift(newGroup);

  const joinedSet = getUserJoinedSet(user.id);
  joinedSet.add(newGroupId);

  res.status(201).json({
    success: true,
    message: 'Study group created successfully!',
    data: {
      ...newGroup,
      isJoined: true
    }
  });
};

export const deleteStudyGroup = (req, res) => {
  const { id } = req.params;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const isSuperAdmin = Boolean(
    user.isSuperAdmin ||
    user.username === 'awaisdemo123' ||
    (user.email && user.email.toLowerCase() === 'criminalmostwanted517@gmail.com')
  );

  const groupIndex = studyGroups.findIndex(g => g.id === id);
  if (groupIndex === -1) {
    return res.status(404).json({ success: false, message: 'Study group not found.' });
  }

  const group = studyGroups[groupIndex];
  const canDelete = isSuperAdmin || user.role === 'admin' || group.creatorId === user.id;

  if (!canDelete) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete this study group.'
    });
  }

  studyGroups.splice(groupIndex, 1);
  res.json({ success: true, message: 'Study group deleted successfully.' });
};
