import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import CreateStudyGroupModal from '../components/CreateStudyGroupModal';
import {
  Users,
  Clock,
  UserPlus,
  UserCheck,
  Plus,
  Search,
  MapPin,
  Trash2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Filter,
  GraduationCap
} from 'lucide-react';

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'joined'
  const [deletingId, setDeletingId] = useState(null);

  const { user, canCreateGroup, isSuperAdmin, openLoginModal } = useAuth();
  const { trackGroupJoin } = useActivity();
  const location = useLocation();

  useEffect(() => {
    fetchGroups();
  }, []);

  // If navigated with ?create=true and authorized, open modal automatically
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true' && canCreateGroup) {
      setIsCreateModalOpen(true);
    }
  }, [location.search, canCreateGroup]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/groups');
      if (res.data.success) {
        setGroups(res.data.data);
      }
    } catch (e) {
      setGroups([
        {
          id: 'grp-1',
          name: 'Algorithm Masters & LeetCode Study Circle',
          description: 'Weekly collaborative session solving advanced graph algorithms, dynamic programming, and reviewing lecture notes.',
          departmentId: 'dep-cs',
          departmentName: 'Computer Science',
          membersCount: 42,
          meetingTime: 'Tuesdays & Thursdays @ 6 PM',
          location: 'Online (Discord & Google Meet)',
          isJoined: false,
          topics: ['Graph Theory', 'Dynamic Programming', 'Sorting'],
          creatorName: 'Dr. Robert Chen',
          creatorRole: 'teacher'
        },
        {
          id: 'grp-2',
          name: 'DBMS Midterm Preparation Group',
          description: 'Focused study group working through past exam papers, relational algebra, and SQL query optimizations.',
          departmentId: 'dep-cs',
          departmentName: 'Computer Science',
          membersCount: 28,
          meetingTime: 'Saturdays @ 2 PM',
          location: 'Campus Science Block 204',
          isJoined: false,
          topics: ['SQL', 'Transactions', 'Indexing'],
          creatorName: 'Sarah Jenkins',
          creatorRole: 'moderator'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleJoin = async (id) => {
    if (!user) {
      openLoginModal();
      return;
    }

    const group = groups.find((g) => g.id === id);
    const isJoining = group ? !group.isJoined : true;

    try {
      await api.post(`/groups/${id}/join`);
    } catch (e) {
      // local optimistic update
    }

    if (trackGroupJoin) trackGroupJoin(isJoining);

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextState = !g.isJoined;
          return {
            ...g,
            isJoined: nextState,
            membersCount: Math.max(0, (g.membersCount || 0) + (nextState ? 1 : -1))
          };
        }
        return g;
      })
    );
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study group?')) return;

    setDeletingId(id);
    try {
      const res = await api.delete(`/groups/${id}`);
      if (res.data.success) {
        setGroups((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete study group.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
  };

  // Helper for creator badges
  const renderCreatorBadge = (creatorRole, creatorName) => {
    if (creatorRole === 'superadmin') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <Sparkles className="w-3 h-3" />
          <span>Super Admin: {creatorName || 'Super Admin'}</span>
        </span>
      );
    }
    if (creatorRole === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Admin: {creatorName || 'Administration'}</span>
        </span>
      );
    }
    if (creatorRole === 'teacher') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <BookOpen className="w-3 h-3" />
          <span>Teacher: {creatorName || 'Faculty Instructor'}</span>
        </span>
      );
    }
    if (creatorRole === 'moderator') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
          <ShieldAlert className="w-3 h-3" />
          <span>Moderator: {creatorName || 'Peer Moderator'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Users className="w-3 h-3" />
        <span>Staff: {creatorName || 'Staff Lead'}</span>
      </span>
    );
  };

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      g.name.toLowerCase().includes(query) ||
      g.description?.toLowerCase().includes(query) ||
      g.creatorName?.toLowerCase().includes(query) ||
      g.topics?.some((t) => t.toLowerCase().includes(query));

    const matchesDept =
      selectedDept === 'all' ||
      g.departmentId === selectedDept ||
      g.departmentName?.toLowerCase().includes(selectedDept.toLowerCase());

    const matchesFilter = filterMode === 'all' || (filterMode === 'joined' && g.isJoined);

    return matchesQuery && matchesDept && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Banner */}
      <div className="academic-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              Collaborative Study Groups
            </h1>
          </div>
          <p className="text-xs max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            Join peer study circles, attend review sessions, and share exam prep materials.
            Organized and led by instructors, moderators, and administration.
          </p>
        </div>

        {/* Action Button: Visible to Admin, Super Admin, Teacher, Moderator */}
        <div className="flex items-center gap-3">
          {canCreateGroup ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Study Group</span>
            </button>
          ) : user ? (
            <div
              className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border"
              style={{
                backgroundColor: 'var(--surface-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Student Access (Join & Collaborate)</span>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25 transition-all cursor-pointer"
            >
              Sign In to Join Groups
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div
        className="academic-card p-4 flex flex-col md:flex-row items-center justify-between gap-3"
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups, topics, leaders..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-all outline-hidden focus:ring-2 focus:ring-indigo-500/40"
            style={{
              backgroundColor: 'var(--surface-input)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* All / Joined Tabs */}
          <div
            className="flex items-center p-1 rounded-xl border text-xs"
            style={{
              backgroundColor: 'var(--surface-input)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-500 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Groups ({groups.length})
            </button>
            <button
              onClick={() => setFilterMode('joined')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'joined'
                  ? 'bg-white dark:bg-slate-800 text-indigo-500 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              My Joined ({groups.filter((g) => g.isJoined).length})
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border transition-all outline-hidden cursor-pointer"
            style={{
              backgroundColor: 'var(--surface-input)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Departments</option>
            <option value="dep-cs">Computer Science</option>
            <option value="dep-ee">Electrical Eng</option>
            <option value="dep-math">Mathematics</option>
            <option value="dep-ba">Business Admin</option>
            <option value="dep-ds">Data Science</option>
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Loading study groups...
          </p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="academic-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            No Study Groups Found
          </h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            {searchQuery || selectedDept !== 'all' || filterMode !== 'all'
              ? 'No study groups match your search criteria. Try adjusting your filters.'
              : 'There are currently no active study groups.'}
          </p>
          {canCreateGroup && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create the First Group</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((g) => {
            const canDelete =
              user &&
              (isSuperAdmin ||
                user.role === 'admin' ||
                (g.creatorId && g.creatorId === user.id));

            return (
              <div
                key={g.id}
                className="academic-card p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        {g.membersCount || 1} Active {g.membersCount === 1 ? 'Member' : 'Members'}
                      </span>
                      {g.departmentName && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: 'var(--surface-input)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {g.departmentName}
                        </span>
                      )}
                    </div>

                    {renderCreatorBadge(g.creatorRole, g.creatorName)}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="font-heading font-bold text-base mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {g.name}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {g.description}
                  </p>

                  {/* Schedule & Location */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{g.meetingTime || 'Flexible schedule'}</span>
                    </div>
                    {g.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{g.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Topics Tags */}
                  {g.topics && g.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {g.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div
                  className="pt-3 border-t flex items-center justify-between gap-2"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Created: {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Active Semester'}
                  </span>

                  <div className="flex items-center gap-2">
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        disabled={deletingId === g.id}
                        title="Delete this study group"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleJoin(g.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        g.isJoined
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                      }`}
                    >
                      {g.isJoined ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Joined</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Join Group</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <CreateStudyGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
}
