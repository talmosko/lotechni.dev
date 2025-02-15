export const ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export type IconSize = keyof typeof ICON_SIZES

export const ICONS = {
  spotify: {
    icon: 'icon-[tabler--brand-spotify]',
    label: 'Spotify',
    hoverColor: 'group-hover:text-social-spotify',
  },
  applePodcasts: {
    icon: 'icon-[tabler--brand-apple-podcast]',
    label: 'Apple Podcasts',
    hoverColor: 'group-hover:text-social-apple',
  },
  youtube: {
    icon: 'icon-[tabler--brand-youtube]',
    label: 'YouTube',
    hoverColor: 'group-hover:text-social-youtube',
  },
  whatsapp: {
    icon: 'icon-[tabler--brand-whatsapp]',
    label: 'WhatsApp',
    hoverColor: 'group-hover:text-social-whatsapp',
  },
  linkedin: {
    icon: 'icon-[tabler--brand-linkedin]',
    label: 'LinkedIn',
    hoverColor: 'group-hover:text-social-linkedin',
  },
  www: {
    icon: 'icon-[tabler--world]',
    label: 'Website',
    hoverColor: 'group-hover:text-accent',
  },
  chevronLeft: {
    icon: 'icon-[tabler--chevron-left]',
    label: 'Chevron Left',
    hoverColor: 'group-hover:text-accent',
  },
  chevronRight: {
    icon: 'icon-[tabler--chevron-right]',
    label: 'Chevron Right',
    hoverColor: 'group-hover:text-accent',
  },
  headphones: {
    icon: 'icon-[tabler--headphones]',
    label: 'Headphones',
    hoverColor: 'group-hover:text-accent',
  },
  share: {
    icon: 'icon-[tabler--share]',
    label: 'Share',
    hoverColor: 'group-hover:text-social-linkedin',
  },
  mobileMenuOpen: {
    icon: 'icon-[tabler--menu-2]',
    label: 'Mobile Menu Open',
    hoverColor: 'group-hover:text-accent',
  },
  mobileMenuClose: {
    icon: 'icon-[tabler--x]',
    label: 'Mobile Menu Close',
    hoverColor: 'group-hover:text-accent',
  },
}

export type IconNames = keyof typeof ICONS
export type IconConfig = (typeof ICONS)[IconNames]

export interface SocialLink {
  icon: IconNames
  url: string
}
