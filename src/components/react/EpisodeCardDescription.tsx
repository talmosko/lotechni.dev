import { cn } from '@utils/cn'
import { useState } from 'react'

interface EpisodeCardDescriptionProps {
  description?: string
  html_description?: string
}

export default function EpisodeCardDescription({
  description,
  html_description,
}: EpisodeCardDescriptionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="mt-2 flex cursor-pointer items-center justify-between"
      onClick={() => setOpen(!open)}>
      {open && html_description ? (
        <div className="mt-2 inline-block" dangerouslySetInnerHTML={{ __html: html_description }} />
      ) : (
        <span className="line-clamp-3">{description}</span>
      )}
      <span
        className={cn(
          'icon-[tabler--caret-down-filled] sticky top-24 min-w-8 self-start text-current transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </div>
  )
}
