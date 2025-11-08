import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function Article() {
  const { slug } = useParams();
  const pretty = (slug || '').replace(/-/g, ' ');
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert">
      <Seo
        title={`${pretty} | Gnanify Learn`}
        description={`In-depth guide: ${pretty} with examples and explanations.`}
        canonical={`/article/${slug}`}
      />
      <h1 className="mb-4">{pretty}</h1>
      <p className="lead">An in-depth article with examples and explanations.</p>
      <h2>Section 1</h2>
      <p>Content for section 1.</p>
      <h2>Section 2</h2>
      <p>Content for section 2.</p>
      <div className="mt-6">
        <Link to="/tutorials" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">← Back to Tutorials</Link>
      </div>
    </article>
  );
}
