import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ActivityContext = createContext();

const loadUserStoredStats = (userId) => {
  if (!userId) return { downloadsCount: 0, aiSessions: 0, resourcesUploaded: 0 };
  try {
    const raw = localStorage.getItem(`academichub_activity_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { downloadsCount: 0, aiSessions: 0, resourcesUploaded: 0 };
};

const saveUserStoredStats = (userId, newStats) => {
  if (!userId) return;
  try {
    localStorage.setItem(
      `academichub_activity_${userId}`,
      JSON.stringify({
        downloadsCount: newStats.downloadsCount || 0,
        aiSessions: newStats.aiSessions || 0,
        resourcesUploaded: newStats.resourcesUploaded || 0,
      })
    );
  } catch (e) {}
};

export const ActivityProvider = ({ children, user }) => {
  // All stats start at 0 when the user hasn't done anything
  const [stats, setStats] = useState({
    bookmarksSaved: 0,
    downloadsCount: 0,
    aiSessions: 0,
    groupsJoined: 0,
    questionsAsked: 0,
    answersGiven: 0,
    resourcesUploaded: 0,
  });

  /**
   * Recompute all stats whenever the logged-in user changes
   */
  const refreshStats = useCallback(async (currentUser) => {
    if (!currentUser) {
      // Reset completely to zero when logged out
      setStats({
        bookmarksSaved: 0,
        downloadsCount: 0,
        aiSessions: 0,
        groupsJoined: 0,
        questionsAsked: 0,
        answersGiven: 0,
        resourcesUploaded: 0,
      });
      return;
    }

    const stored = loadUserStoredStats(currentUser.id);

    try {
      // Fetch live data from server for the active user
      const [bookmarkRes, groupRes, questionRes] = await Promise.allSettled([
        api.get('/resources/bookmarks'),
        api.get('/groups'),
        api.get('/questions'),
      ]);

      const bookmarkCount =
        bookmarkRes.status === 'fulfilled' && bookmarkRes.value.data.success
          ? bookmarkRes.value.data.data.length
          : 0;

      const groupCount =
        groupRes.status === 'fulfilled' && groupRes.value.data.success
          ? groupRes.value.data.data.filter((g) => g.isJoined).length
          : 0;

      // Count questions and answers authored specifically by this user
      const allQuestions =
        questionRes.status === 'fulfilled' && questionRes.value.data.success
          ? questionRes.value.data.data
          : [];

      const questionsAsked = allQuestions.filter(
        (q) =>
          (q.authorId && q.authorId === currentUser.id) ||
          (currentUser.name && q.authorName === currentUser.name && q.authorId !== 'u-seed-student')
      ).length;

      const answersGiven = allQuestions.reduce((count, q) => {
        return (
          count +
          (q.answers || []).filter(
            (a) =>
              (a.authorId && a.authorId === currentUser.id) ||
              (currentUser.name && a.authorName === currentUser.name && a.authorId !== 'u2')
          ).length
        );
      }, 0);

      setStats({
        bookmarksSaved: bookmarkCount,
        groupsJoined: groupCount,
        questionsAsked,
        answersGiven,
        downloadsCount: stored.downloadsCount || 0,
        aiSessions: stored.aiSessions || 0,
        resourcesUploaded: stored.resourcesUploaded || 0,
      });
    } catch (err) {
      console.warn('ActivityContext: Failed to fetch activity stats', err.message);
      setStats({
        bookmarksSaved: 0,
        groupsJoined: 0,
        questionsAsked: 0,
        answersGiven: 0,
        downloadsCount: stored.downloadsCount || 0,
        aiSessions: stored.aiSessions || 0,
        resourcesUploaded: stored.resourcesUploaded || 0,
      });
    }
  }, []);

  // Refresh whenever the logged-in user changes (login / logout / switch)
  useEffect(() => {
    refreshStats(user);
  }, [user, refreshStats]);

  /** Call this after every download action */
  const trackDownload = useCallback(() => {
    setStats((prev) => {
      const next = { ...prev, downloadsCount: prev.downloadsCount + 1 };
      if (user?.id) saveUserStoredStats(user.id, next);
      return next;
    });
  }, [user]);

  /** Call this after every AI session is started */
  const trackAiSession = useCallback(() => {
    setStats((prev) => {
      const next = { ...prev, aiSessions: prev.aiSessions + 1 };
      if (user?.id) saveUserStoredStats(user.id, next);
      return next;
    });
  }, [user]);

  /** Call this after posting a question */
  const trackQuestion = useCallback(() => {
    setStats((prev) => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }));
  }, []);

  /** Call this after posting an answer */
  const trackAnswer = useCallback(() => {
    setStats((prev) => ({ ...prev, answersGiven: prev.answersGiven + 1 }));
  }, []);

  /** Call this after joining/leaving a group */
  const trackGroupJoin = useCallback((isJoining) => {
    setStats((prev) => ({
      ...prev,
      groupsJoined: Math.max(0, prev.groupsJoined + (isJoining ? 1 : -1)),
    }));
  }, []);

  /** Call this after uploading a resource */
  const trackUpload = useCallback(() => {
    setStats((prev) => {
      const next = { ...prev, resourcesUploaded: prev.resourcesUploaded + 1 };
      if (user?.id) saveUserStoredStats(user.id, next);
      return next;
    });
  }, [user]);

  /** Sync bookmark count from ResourceContext */
  const syncBookmarks = useCallback((count) => {
    setStats((prev) => ({ ...prev, bookmarksSaved: Math.max(0, count) }));
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        stats,
        refreshStats,
        trackDownload,
        trackAiSession,
        trackQuestion,
        trackAnswer,
        trackGroupJoin,
        trackUpload,
        syncBookmarks,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
