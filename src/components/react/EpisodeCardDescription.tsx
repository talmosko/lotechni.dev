import { useState } from 'react';

interface EpisodeCardDescriptionProps {
  audio_preview_url?: string | null;
  description?: string;
  html_description?: string;
  images: any[];
  name: string;
}

export default function EpisodeCardDescription({ description, html_description }: EpisodeCardDescriptionProps) {
  const maxSummaryLength = 150;
  const trimmedSummary =
    description && description.length > maxSummaryLength
      ? description.slice(0, maxSummaryLength) + '...'
      : description || '';

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="mt-2 cursor-pointer flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span>{open && html_description ? <div className="mt-2 inline-block" dangerouslySetInnerHTML={{ __html: html_description }} /> : trimmedSummary}</span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 self-start ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </>
  );
}
