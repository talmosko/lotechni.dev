import { cn } from '@utils/cn'
import { useState } from 'react'

interface EpisodeCardDescriptionProps {
  description?: string
  html_description?: string
  expandable?: boolean
}

export default function EpisodeCardDescription({
  description,
  html_description,
  expandable = true,
}: EpisodeCardDescriptionProps) {
  const [open, setOpen] = useState(!expandable)

  return (
    <div
      className={cn('mt-2 flex items-center justify-between', expandable && 'cursor-pointer')}
      onClick={() => expandable && setOpen(!open)}>
      {open && html_description ? (
        <div className="mt-2 inline-block" dangerouslySetInnerHTML={{ __html: html_description }} />
      ) : (
        <span className={cn('line-clamp-3', !expandable && 'line-clamp-none')}>{description}</span>
      )}
      {expandable && (
        <span
          className={cn(
            'icon-[tabler--caret-down-filled] sticky top-24 min-w-8 self-start text-current transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      )}
    </div>
  )
}
