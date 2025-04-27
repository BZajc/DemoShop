'use client';

import { useState } from 'react';

interface SearchFilterTabsProps {
  results: {
    users: { id: string }[];
    posts: { id: string }[];
    collections: { id: string }[];
  };
  onChange: (filter: 'all' | 'users' | 'posts' | 'collections') => void;
}

export default function SearchFilterTabs({ results, onChange }: SearchFilterTabsProps) {
  const [active, setActive] = useState<'all' | 'users' | 'posts' | 'collections'>('all');

  const sections = [
    { id: 'users', label: 'Users', count: results.users.length },
    { id: 'posts', label: 'Posts', count: results.posts.length },
    { id: 'collections', label: 'Collections', count: results.collections.length },
  ].filter((section) => section.count > 0);

  if (sections.length === 0) return null;

  return (
    <nav className="flex gap-4 text-sm text-sky-600 font-medium border-b pb-2">
      <button
        onClick={() => {
          setActive('all');
          onChange('all');
        }}
        className={`hover:underline ${active === 'all' ? 'text-sky-800 font-semibold' : ''}`}
      >
        All
      </button>

      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => {
            setActive(section.id as 'users' | 'posts' | 'collections');
            onChange(section.id as 'users' | 'posts' | 'collections');
          }}
          className={`hover:underline ${active === section.id ? 'text-sky-800 font-semibold' : ''}`}
        >
          {section.label} ({section.count})
        </button>
      ))}
    </nav>
  );
}
