import { api, LEARN_API_BASE } from './api';

type ApiSubtopic = {
  id: string;
  title: string;
  content: string;
  likes?: number;
  dislikes?: number;
};

type ApiTopic = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  subtopics?: ApiSubtopic[];
};

type ApiSubject = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  topics?: ApiTopic[];
};

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subjects?: ApiSubject[];
};

export type LearnCategory = {
  slug: string;
  title: string;
  description?: string;
  topics: Array<{ slug: string; title: string; summary?: string; difficulty?: string; readTime?: string; sectionCount?: number; tutorialSlug?: string }>;
  subjects?: Array<{
    slug: string;
    title: string;
    description?: string;
    topics: Array<{ slug: string; title: string; tutorialSlug: string; summary?: string; difficulty?: string; readTime?: string; sectionCount?: number }>;
  }>;
};

export type LearnCategoriesResponse = { categories: LearnCategory[] };

export type LearnTopic = {
  category?: { slug: string; title: string };
  slug: string;
  title: string;
  summary?: string;
  difficulty?: string;
  readTime?: string;
  sections: Array<{ id: string; title: string }>;
};

export type LearnSubtopic = {
  category: { slug: string; title: string };
  topic: { slug: string; title: string };
  subtopic: { id: string; title: string; content: string };
};

export type LearnSearchItem = { title: string; to: string; meta: string };
export type LearnSearchResponse = { results: LearnSearchItem[] };

let cachedCategories: ApiCategory[] | null = null;

async function fetchCategoryTree(force = false): Promise<ApiCategory[]> {
  if (!force && cachedCategories) {
    return cachedCategories;
  }
  const data = await api.get<ApiCategory[]>(`${LEARN_API_BASE}/categories/`);
  cachedCategories = Array.isArray(data) ? data : [];
  return cachedCategories;
}

function computeReadTime(subtopics?: ApiSubtopic[]): string | undefined {
  if (!subtopics || subtopics.length === 0) return undefined;
  const minutes = Math.max(1, Math.round(subtopics.length * 4));
  return `${minutes} min`;
}

function normalizeSubject(subject: ApiSubject) {
  const topics = (subject.topics || []).map((topic) => ({
    slug: topic.slug,
    tutorialSlug: topic.slug,
    title: topic.title,
    summary: topic.description || undefined,
    difficulty: undefined,
    readTime: computeReadTime(topic.subtopics),
    sectionCount: topic.subtopics?.length ?? 0,
  }));
  return {
    slug: subject.slug,
    title: subject.name,
    description: subject.description,
    topics,
  };
}

function normalizeCategory(category: ApiCategory): LearnCategory {
  const subjects = (category.subjects || []).map(normalizeSubject);
  const aggregated = new Map<string, LearnCategory['topics'][number]>();
  subjects.forEach((subject) => {
    subject.topics.forEach((topic) => {
      if (!aggregated.has(topic.slug)) {
        aggregated.set(topic.slug, { ...topic });
      }
    });
  });
  return {
    slug: category.slug,
    title: category.name,
    description: category.description,
    topics: Array.from(aggregated.values()),
    subjects,
  };
}

function findCategoryAndTopic(tree: ApiCategory[], categorySlug: string, topicSlug: string) {
  for (const category of tree) {
    if (category.slug !== categorySlug) continue;
    for (const subject of category.subjects || []) {
      const topic = (subject.topics || []).find((t) => t.slug === topicSlug);
      if (topic) {
        return { category, subject, topic };
      }
    }
    return { category, subject: null, topic: null };
  }
  return { category: null, subject: null, topic: null };
}

function findSubtopic(tree: ApiCategory[], categorySlug: string, topicSlug: string, subtopicId: string) {
  const match = findCategoryAndTopic(tree, categorySlug, topicSlug);
  if (!match.category || !match.topic) {
    return { ...match, subtopic: null };
  }
  const subtopic = (match.topic.subtopics || []).find((sub) => String(sub.id) === String(subtopicId));
  return { ...match, subtopic };
}

async function listCategories(): Promise<LearnCategoriesResponse> {
  const tree = await fetchCategoryTree();
  return { categories: tree.map(normalizeCategory) };
}

async function getCategory(categorySlug: string): Promise<LearnCategory> {
  const tree = await fetchCategoryTree();
  const category = tree.find((cat) => cat.slug === categorySlug);
  if (!category) {
    throw new Error('Category not found');
  }
  return normalizeCategory(category);
}

async function getTopic(categorySlug: string, topicSlug: string): Promise<LearnTopic> {
  const tree = await fetchCategoryTree();
  const { category, topic } = findCategoryAndTopic(tree, categorySlug, topicSlug);
  if (!category || !topic) {
    throw new Error('Topic not found');
  }
  const sections = (topic.subtopics || []).map((sub) => ({ id: String(sub.id), title: sub.title }));
  return {
    category: { slug: category.slug, title: category.name },
    slug: topic.slug,
    title: topic.title,
    summary: topic.description || '',
    difficulty: undefined,
    readTime: computeReadTime(topic.subtopics),
    sections,
  };
}

async function getSubtopic(categorySlug: string, topicSlug: string, subtopicId: string): Promise<LearnSubtopic> {
  const tree = await fetchCategoryTree();
  const { category, topic, subtopic } = findSubtopic(tree, categorySlug, topicSlug, subtopicId);
  if (!category || !topic || !subtopic) {
    throw new Error('Subtopic not found');
  }
  return {
    category: { slug: category.slug, title: category.name },
    topic: { slug: topic.slug, title: topic.title },
    subtopic: { id: String(subtopic.id), title: subtopic.title, content: subtopic.content || '' },
  };
}

function invalidateCategoriesCache() {
  cachedCategories = null;
}

export const learnApi = {
  listCategories,
  getCategory,
  getTopic,
  getSubtopic,
  refresh: () => fetchCategoryTree(true).then(() => undefined),
  invalidateCache: invalidateCategoriesCache,
  search: (q: string) => api.get<LearnSearchResponse>(`${LEARN_API_BASE}/search?q=${encodeURIComponent(q)}`),
  featured: () => api.get<{ featured: Array<{ to: string; title: string; summary?: string; meta?: string }> }>(`${LEARN_API_BASE}/featured/`),
};
