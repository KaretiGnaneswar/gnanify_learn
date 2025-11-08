import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { findTopic } from '../data/tutorials';

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

  return (
    <article className="prose prose-slate max-w-none dark:prose-invert">
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
    </article>
  );
}
