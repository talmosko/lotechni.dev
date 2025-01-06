export const ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export type IconSize = keyof typeof ICON_SIZES

export const SOCIAL_ICONS = {
  spotify: {
    icon: 'icon-[iconoir--spotify]',
    label: 'Spotify',
    hoverColor: 'group-hover:text-social-spotify',
  },
  applePodcasts: {
    icon: 'icon-[iconoir--podcast]',
    label: 'Apple Podcasts',
    hoverColor: 'group-hover:text-social-apple',
  },
  youtube: {
    icon: 'icon-[iconoir--youtube]',
    label: 'YouTube',
    hoverColor: 'group-hover:text-social-youtube',
  },
  whatsapp: {
    icon: 'icon-[iconoir--whatsapp]',
    label: 'WhatsApp',
    hoverColor: 'group-hover:text-social-whatsapp',
  },
  linkedin: {
    icon: 'icon-[iconoir--linkedin]',
    label: 'LinkedIn',
    hoverColor: 'group-hover:text-social-linkedin',
  },
  www: {
    icon: 'icon-[iconoir--www]',
    label: 'Website',
    hoverColor: 'group-hover:text-accent',
  },
}

export type IconNames = keyof typeof SOCIAL_ICONS
export type IconConfig = (typeof SOCIAL_ICONS)[IconNames]

export interface SocialLink {
  icon: IconNames
  url: string
}
