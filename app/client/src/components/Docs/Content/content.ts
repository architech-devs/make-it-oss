export type DocBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'link'; text: string; href: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface DocSection {
  id: string;
  title: string;
  blocks: DocBlock[];
}

export const docsSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    blocks: [
      { type: 'paragraph', text: 'Welcome to make-it-oss! This guide helps you get productive quickly.' },
      { type: 'subheading', text: 'Prerequisites' },
      {
        type: 'list',
        items: ['Node.js 18+', 'Git installed', 'A GitHub account'],
      },
      { type: 'subheading', text: 'Quick Start' },
      {
        type: 'code',
        language: 'bash',
        code: 'git clone https://github.com/your/repo\ncd repo\npm install\nnpm run dev',
      },
      {
        type: 'paragraph',
        text: 'After running the dev server, open http://localhost:5173 in your browser.',
      },
      { type: 'link', text: 'Project README', href: 'https://example.com/readme' },
    ],
  },
  {
    id: 'concepts',
    title: 'Core Concepts',
    blocks: [
      { type: 'heading', text: 'Architecture Overview' },
      {
        type: 'paragraph',
        text: 'The app has a Vite + React frontend and a Node/Express backend. Components are organized by feature.',
      },
      {
        type: 'table',
        headers: ['Layer', 'Location', 'Notes'],
        rows: [
          ['Client', 'app/client', 'Vite + React + Tailwind'],
          ['Server', 'app/server', 'Express API endpoints'],
          ['Docs', 'src/components/Docs', 'Sidebar + Content renderer'],
        ],
      },
      { type: 'subheading', text: 'Why a Content Schema?' },
      {
        type: 'paragraph',
        text: 'Keeping docs in a typed .ts file enables reusable rendering, compile-time checks, and simple theming.',
      },
      {
        type: 'code',
        language: 'ts',
        code: 'export type DocBlock =\n  | { type: "paragraph"; text: string }\n  | { type: "code"; language: string; code: string };',
      },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    blocks: [
      { type: 'paragraph', text: 'Below is a small React example using a button component.' },
      {
        type: 'code',
        language: 'tsx',
        code: "import { useState } from 'react'\n\nexport default function Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <button onClick={() => setCount((c) => c + 1)} className=\"px-3 py-1 rounded bg-black text-white dark:bg-white dark:text-black\">\n      Count: {count}\n    </button>\n  )\n}",
      },
      { type: 'subheading', text: 'Further Reading' },
      { type: 'list', ordered: true, items: ['ShadCN UI', 'Tailwind CSS', 'Vite Docs'] },
      { type: 'link', text: 'Open Source Guide', href: 'https://example.com/oss' },
    ],
  },
];

export type { DocSection as TDocSection };

