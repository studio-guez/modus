export type CardType =
  | 'video'
  | 'podcast'
  | 'report'
  | 'tool-internal'
  | 'tool-external'
  | 'project-modus'
  | 'project-supported'

export type ClickBehavior = 'navigate' | 'external' | 'play-video' | 'play-podcast'
export type OverlayIcon = 'play' | 'mic' | null

export interface CardConfig {
  actionLabel: string
  clickBehavior: ClickBehavior
  overlayIcon: OverlayIcon
  hasPdfButton?: boolean
  hasDateLabel?: boolean
  hasStatus?: boolean
}

export const CARD_CONFIG: Record<CardType, CardConfig> = {
  'video':             { actionLabel: 'Regarder',  clickBehavior: 'play-video',   overlayIcon: 'play', hasDateLabel: true },
  'podcast':           { actionLabel: 'Écouter',   clickBehavior: 'play-podcast', overlayIcon: 'mic',  hasDateLabel: true },
  'report':            { actionLabel: 'Consulter', clickBehavior: 'navigate',     overlayIcon: null, hasPdfButton: true },
  'tool-internal':     { actionLabel: 'Tester',   clickBehavior: 'navigate',     overlayIcon: null },
  'tool-external':     { actionLabel: 'Tester', clickBehavior: 'external',     overlayIcon: null },
  'project-modus':     { actionLabel: 'Découvrir', clickBehavior: 'navigate',     overlayIcon: null, hasDateLabel: true, hasStatus: true },
  'project-supported': { actionLabel: 'Découvrir', clickBehavior: 'navigate',     overlayIcon: null, hasDateLabel: true, hasStatus: true },
} as const

export const DEFAULT_CARD_TYPE: CardType = 'project-supported'

export function getCardConfig(cardType: CardType | undefined): CardConfig {
  return CARD_CONFIG[cardType ?? DEFAULT_CARD_TYPE] ?? CARD_CONFIG[DEFAULT_CARD_TYPE]
}
