import React from 'react';

/**
 * Reusable Card Skeleton for resources and grid items
 */
export function ResourceCardSkeleton() {
  return (
    <div className="academic-card p-5 space-y-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
          <div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2.5 bg-slate-100 rounded w-full" />
        <div className="h-2.5 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 bg-slate-100 rounded w-20" />
        <div className="h-7 bg-slate-200 rounded-lg w-16" />
      </div>
    </div>
  );
}

/**
 * Stat Card Skeleton for dashboards
 */
export function StatCardSkeleton() {
  return (
    <div className="academic-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="w-8 h-8 rounded-lg bg-slate-100" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-16" />
      <div className="h-2.5 bg-slate-100 rounded w-32" />
    </div>
  );
}

/**
 * List Item Skeleton for activity and feeds
 */
export function ListItemSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-slate-100 space-y-2.5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-2.5 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
      <div className="h-2.5 bg-slate-100 rounded w-4/5" />
    </div>
  );
}

export default {
  ResourceCardSkeleton,
  StatCardSkeleton,
  ListItemSkeleton
};
