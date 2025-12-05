import React from 'react'

export const Skeleton = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`}></div>
)

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-3/4" />
  </div>
)

