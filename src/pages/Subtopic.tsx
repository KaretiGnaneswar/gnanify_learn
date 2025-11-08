import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { findTopic } from '../data/tutorials';
import Seo from '../components/Seo';

interface SubtopicParams {
  category: string;
  topic: string;
  subtopic: string;
}

export default function Subtopic() {
  const { category, topic, subtopic } = useParams<keyof SubtopicParams>() as SubtopicParams;
  const topicData = findTopic(category, topic);
  
  if (!topicData) {
    return <div className="text-sm text-neutral-500">Topic not found.</div>;
  }

  const section = topicData.sections.find(s => s.id === subtopic);
  
  if (!section) {
    return <div className="text-sm text-neutral-500">Subtopic not found.</div>;
  }

  const currentIndex = topicData.sections.findIndex(s => s.id === subtopic);
  const prevSection = currentIndex > 0 ? topicData.sections[currentIndex - 1] : null;
  const nextSection = currentIndex < topicData.sections.length - 1 ? topicData.sections[currentIndex + 1] : null;

  const description = (section.content || '').slice(0, 160);
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert pb-20 md:pb-0">
      <Seo
        title={`${section.title} — ${topicData.title} | Gnanify Learn`}
        description={description}
        canonical={`/tutorials/${category}/${topic}/${subtopic}`}
      />
      <h1 className="mb-4">{section.title}</h1>
      <div className="mb-6">
        <Link 
          to={`/tutorials/${category}/${topic}`}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          ← Back to {topicData.title}
        </Link>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>{section.content}</p>
      </div>

      <div className="mt-12 flex justify-between border-t border-neutral-200 dark:border-neutral-800 pt-6">
        {prevSection ? (
          <Link 
            to={`/tutorials/${category}/${topic}/${prevSection.id}`}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            ← {prevSection.title}
          </Link>
        ) : <div />}
        
        {nextSection ? (
          <Link 
            to={`/tutorials/${category}/${topic}/${nextSection.id}`}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {nextSection.title} →
          </Link>
        ) : <div />}
      </div>

      {/* Mobile sticky prev/next */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-3">
          {prevSection ? (
            <Link
              to={`/tutorials/${category}/${topic}/${prevSection.id}`}
              className="min-w-0 flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
            >
              ← Prev
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {nextSection ? (
            <Link
              to={`/tutorials/${category}/${topic}/${nextSection.id}`}
              className="min-w-0 flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white"
            >
              Next →
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      </div>
    </article>
  );
}
