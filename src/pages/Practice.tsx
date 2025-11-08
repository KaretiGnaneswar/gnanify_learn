import React from 'react';
import Seo from '../components/Seo';

export default function Practice() {
  const sets = [
    { title: 'DSA Warmup', count: 20 },
    { title: 'Java Basics', count: 15 },
    { title: 'React Hooks', count: 10 },
  ];
  return (
    <div className="space-y-6">
      <Seo
        title="Practice – Gnanify Learn"
        description="Practice DSA, Java, React, and more. Sharpen your skills with curated problem sets on Gnanify Learn."
        canonical="/practice"
      />
      <h1 className="text-2xl font-semibold">Practice</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sets.map((s, i) => (
          <div key={i} className="card">
            <div className="card-body">
              <div className="text-lg font-medium">{s.title}</div>
              <div className="text-sm text-neutral-500">{s.count} problems</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
