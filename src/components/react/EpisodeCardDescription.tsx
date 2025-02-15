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
      className={cn('mt-4 flex flex-col', expandable && 'cursor-pointer')}
      onClick={() => expandable && setOpen(!open)}>
      {expandable && (
        <span
          className={cn(
            'icon-[tabler--caret-down-filled] self-end text-current transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      )}
      <div className="flex-1">
        {open && html_description ? (
          <div dangerouslySetInnerHTML={{ __html: html_description }} />
        ) : (
          <p className={cn('line-clamp-3', !expandable && 'line-clamp-none')}>{description}</p>
        )}
      </div>
    </div>
  )
}
