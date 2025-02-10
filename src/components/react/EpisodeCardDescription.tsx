import { useState } from 'react';

interface EpisodeCardDescriptionProps {
  description?: string;
  html_description?: string;
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
        {open && html_description ? <div className="mt-2 inline-block" dangerouslySetInnerHTML={{ __html: html_description }} /> : <span>{trimmedSummary}</span>}
        <span className={`icon-[tabler--caret-down-filled] text-current min-w-8 self-start transition-transform duration-200 sticky top-24 ${open ? 'rotate-180' : ''}`}></span>
      </div>
    </>
  );
}
