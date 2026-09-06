import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  // Start empty — loaded from server for the actual logged-in user
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [activePdfResource, setActivePdfResource] = useState(null);
  const [activeAiResource, setActiveAiResource] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { syncBookmarks, trackDownload } = useActivity();

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources', {
        params: {
          search: searchQuery,
          department: selectedDept,
          course: selectedCourse,
          category: selectedCategory,
        },
      });
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.warn('Using fallback local dataset for resources');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDept, selectedCourse, selectedCategory]);

  const fetchMetaData = useCallback(async () => {
    try {
      const dRes = await api.get('/departments');
      if (dRes.data.success) setDepartments(dRes.data.data);
      const cRes = await api.get('/courses');
      if (cRes.data.success) setCourses(cRes.data.data);
    } catch (e) {
      console.warn('Using fallback metadata');
    }
  }, []);

  /** Load the actual logged-in user's bookmarks from the server */
  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      syncBookmarks(0);
      return;
    }
    try {
      const res = await api.get('/resources/bookmarks');
      if (res.data.success) {
        const ids = res.data.data.map((r) => r.id);
        setBookmarks(ids);
        syncBookmarks(ids.length);
      }
    } catch (e) {
      // Unauthenticated or server error → no bookmarks
      setBookmarks([]);
      syncBookmarks(0);
    }
  }, [user, syncBookmarks]);

  useEffect(() => {
    fetchMetaData();
    fetchBookmarks();
  }, [fetchMetaData, fetchBookmarks]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const toggleBookmark = async (id) => {
    try {
      const res = await api.post(`/resources/${id}/bookmark`);
      if (res.data.success) {
        setBookmarks(res.data.bookmarks);
        syncBookmarks(res.data.bookmarks.length);
      }
    } catch (e) {
      setBookmarks((prev) => {
        const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
        syncBookmarks(next.length);
        return next;
      });
    }
  };

  /** Download a resource — opens URL and increments the activity download counter */
  const downloadResource = async (resource) => {
    try {
      await api.post(`/resources/${resource.id}/download`);
    } catch (e) {
      // Non-critical
    }
    trackDownload();
    if (resource.fileUrl && resource.fileUrl !== '#') {
      window.open(resource.fileUrl, '_blank');
    }
  };

  const approveResource = async (id) => {
    try {
      await api.patch(`/resources/${id}/status`, { status: 'approved' });
      fetchResources();
    } catch (e) {
      setResources((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
    }
  };

  const rejectResource = async (id) => {
    try {
      await api.patch(`/resources/${id}/status`, { status: 'rejected' });
      fetchResources();
    } catch (e) {
      setResources((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        resources,
        setResources,
        departments,
        courses,
        bookmarks,
        toggleBookmark,
        downloadResource,
        approveResource,
        rejectResource,
        loading,
        searchQuery,
        setSearchQuery,
        selectedDept,
        setSelectedDept,
        selectedCourse,
        setSelectedCourse,
        selectedCategory,
        setSelectedCategory,
        activePdfResource,
        setActivePdfResource,
        activeAiResource,
        setActiveAiResource,
        isUploadOpen,
        setIsUploadOpen,
        fetchResources,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => useContext(ResourceContext);
