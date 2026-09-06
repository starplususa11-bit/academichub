import React from 'react';
import { useResources } from '../context/ResourceContext';
import ResourceCard from '../components/ResourceCard';
import { ResourceCardSkeleton } from '../components/SkeletonLoader';
import { Search, Filter, RefreshCw, FileText } from 'lucide-react';

export default function ResourcesPage() {
  const {
    resources,
    departments,
    courses,
    loading,
    searchQuery,
    setSearchQuery,
    selectedDept,
    setSelectedDept,
    selectedCourse,
    setSelectedCourse,
    selectedCategory,
    setSelectedCategory
  } = useResources();

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedCategory('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header & Catalog Search */}
      <div className="academic-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-900">Academic Resource Catalog</h1>
          <p className="text-xs text-slate-500">Discover verified lecture notes, past papers, lab manuals, and course presentations</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by keyword, topic, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Layout (Filters + Grid) */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 shrink-0 academic-card p-5 space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Catalog Filters</span>
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Target Course */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Lecture Notes">Lecture Notes</option>
              <option value="Past Papers">Past Papers</option>
              <option value="Lab Manuals">Lab Manuals</option>
              <option value="Presentations">Presentations</option>
              <option value="Assignments & Solutions">Assignments & Solutions</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Showing <strong className="text-slate-900">{resources.length}</strong> academic resources</span>
            <span>Sort: <strong className="text-slate-900">Highest Rated</strong></span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ResourceCardSkeleton />
              <ResourceCardSkeleton />
              <ResourceCardSkeleton />
              <ResourceCardSkeleton />
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {resources.map(res => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="academic-card p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-heading font-bold text-slate-800 text-sm">No resources match your filters</h3>
              <p className="text-xs text-slate-500">Try clearing selected filters or search with another keyword.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
