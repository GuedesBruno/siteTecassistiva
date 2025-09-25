'use client';

import { useState } from 'react';

export default function Accordion({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  let renderedContent;
  if (typeof content === 'string') {
    renderedContent = content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  } else {
    // Assume it's a React node or an array of nodes
    renderedContent = content;
  }

  return (
    <div className="border-t border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-lg font-semibold text-left text-gray-800 hover:text-blue-600 focus:outline-none"
      >
        <span>{title}</span>
        <svg
          className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 2 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 prose prose-sm max-w-none text-gray-700">
          {renderedContent}
        </div>
      )}
    </div>
  );
}
