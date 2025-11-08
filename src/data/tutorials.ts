export type TutorialSection = { id: string; title: string; content: string };
export type TutorialTopic = {
  slug: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  sections: TutorialSection[];
};
export type TutorialCategory = {
  slug: string;
  title: string;
  topics: TutorialTopic[];
};

// Helpers to keep data compact but rich
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const makeSections = (titles: string[]): TutorialSection[] =>
  titles.map((t) => ({ id: slugify(t), title: t, content: `${t} — detailed explanation with examples and notes.` }));

const makeTopics = (names: string[], summaryPrefix: string): TutorialTopic[] =>
  names.map((name, idx) => ({
    slug: slugify(name),
    title: name,
    summary: `${summaryPrefix} — ${name}.` ,
    difficulty: (['Beginner','Intermediate','Advanced'] as const)[idx % 3],
    readTime: `${8 + (idx % 7)} min`,
    sections: makeSections(['Introduction', 'Core Concepts', 'Examples']),
  }));

const CATEGORY_DEFS: { slug: string; title: string; topicNames: string[]; summary: string }[] = [
  {
    slug: 'dsa',
    title: 'Data Structures & Algorithms',
    summary: 'Learn DSA topic',
    topicNames: ['Introduction to DSA','Arrays','Linked Lists','Stacks','Queues','Trees','Graphs','Hashing','Sorting','Searching']
  },
  {
    slug: 'web',
    title: 'Web Development',
    summary: 'Web development topic',
    topicNames: ['HTML Basics','CSS Fundamentals','Responsive Design','JavaScript Essentials','TypeScript','React Basics','Next.js','Node.js & Express','REST APIs','Authentication']
  },
  {
    slug: 'python',
    title: 'Python Programming',
    summary: 'Python programming topic',
    topicNames: ['Introduction to Python','Control Flow','Functions','Collections','OOP in Python','File I/O','Error Handling','Modules & Packages','Virtual Environments','Asyncio']
  },
  {
    slug: 'java',
    title: 'Java Programming',
    summary: 'Java programming topic',
    topicNames: ['Java Basics','OOP in Java','Collections Framework','Generics','Streams & Lambdas','Exception Handling','I/O & NIO','Multithreading','JDBC','Spring Boot Intro']
  },
  {
    slug: 'os',
    title: 'Operating Systems',
    summary: 'Operating systems topic',
    topicNames: ['Introduction to OS','Processes & Threads','CPU Scheduling','Synchronization','Deadlocks','Memory Management','Virtual Memory','File Systems','I/O Systems','Linux Basics']
  },
  {
    slug: 'cn',
    title: 'Computer Networks',
    summary: 'Computer networks topic',
    topicNames: ['OSI Model','TCP/IP Suite','IP Addressing','Routing Basics','DNS & HTTP','Transport Layer','Congestion Control','Wireless Networks','Network Security','CDN & Caching']
  },
  {
    slug: 'ml',
    title: 'Machine Learning',
    summary: 'Machine learning topic',
    topicNames: ['ML Overview','Supervised Learning','Unsupervised Learning','Model Evaluation','Feature Engineering','Linear Models','Tree-Based Models','Clustering','Dimensionality Reduction','Intro to Neural Nets']
  },
  {
    slug: 'devops',
    title: 'DevOps & Cloud',
    summary: 'DevOps topic',
    topicNames: ['Git & GitHub','CI/CD Basics','Docker','Kubernetes Intro','Infrastructure as Code','Monitoring & Logging','Cloud Fundamentals','AWS Basics','GCP Basics','Azure Basics']
  },
  {
    slug: 'cpp',
    title: 'C++ Programming',
    summary: 'C++ programming topic',
    topicNames: ['C++ Basics','Pointers & References','OOP in C++','STL Vectors & Arrays','STL Maps & Sets','Templates','Move Semantics','Memory Management','File I/O','Concurrency Basics']
  },
  {
    slug: 'dbms',
    title: 'Database Systems',
    summary: 'DBMS topic',
    topicNames: ['Relational Model','SQL Basics','Joins & Subqueries','Indexes','Transactions & ACID','Normalization','NoSQL Overview','MongoDB Basics','PostgreSQL Features','Query Optimization']
  },
  {
    slug: 'os',
    title: 'Operating Systems',
    summary: 'Operating systems topic',
    topicNames: ['Introduction to OS','Processes & Threads','CPU Scheduling','Synchronization','Deadlocks','Memory Management','Virtual Memory','File Systems','I/O Systems','Linux Basics']
  },
  {
    slug: 'cn',
    title: 'Computer Networks',
    summary: 'Computer networks topic',
    topicNames: ['OSI Model','TCP/IP Suite','IP Addressing','Routing Basics','DNS & HTTP','Transport Layer','Congestion Control','Wireless Networks','Network Security','CDN & Caching']
  },
  {
    slug: 'ml',
    title: 'Machine Learning',
    summary: 'Machine learning topic',
    topicNames: ['ML Overview','Supervised Learning','Unsupervised Learning','Model Evaluation','Feature Engineering','Linear Models','Tree-Based Models','Clustering','Dimensionality Reduction','Intro to Neural Nets']
  },
  {
    slug: 'devops',
    title: 'DevOps & Cloud',
    summary: 'DevOps topic',
    topicNames: ['Git & GitHub','CI/CD Basics','Docker','Kubernetes Intro','Infrastructure as Code','Monitoring & Logging','Cloud Fundamentals','AWS Basics','GCP Basics','Azure Basics']
  },
];

export const TUTORIALS: TutorialCategory[] = CATEGORY_DEFS.map((c) => ({
  slug: c.slug,
  title: c.title,
  topics: makeTopics(c.topicNames, c.summary),
})).map((cat) => {
  // Specialize DSA intro subtopics
  if (cat.slug === 'dsa') {
    const intro = cat.topics.find(t => t.slug === 'introduction-to-dsa');
    if (intro) {
      intro.sections = [
        { id: slugify('Introduction'), title: 'Introduction', content: 'What is DSA? Why complexity matters, how to analyze algorithms.' },
        { id: slugify('Big O Notation'), title: 'Big O Notation', content: 'Upper bound analysis with examples for arrays, loops, nested loops.' },
        { id: slugify('Big Omega'), title: 'Big Omega', content: 'Lower bound best-case analysis and when it is useful.' },
        { id: slugify('Theta Notation'), title: 'Theta Notation', content: 'Tight bound and how to prove it with examples.' },
        { id: slugify('Best / Average / Worst'), title: 'Best / Average / Worst', content: 'Comparing cases for common algorithms and what to report in interviews.' },
      ];
    }
  }
  return cat;
});

export function findCategory(slug?: string) {
  return TUTORIALS.find((c) => c.slug === slug);
}
export function findTopic(categorySlug?: string, topicSlug?: string) {
  const cat = findCategory(categorySlug);
  return cat?.topics.find((t) => t.slug === topicSlug);
}
