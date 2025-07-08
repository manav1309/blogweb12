export interface Block {
  id?: string
  type: "heading" | "paragraph" | "image" | "button" | "list" | "code" | "divider" | "spacer"
  content?: string
  level?: number
  src?: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  variant?: string
  size?: string
  ordered?: boolean
  items?: string[]
  language?: string
  anchor?: string
  link?: {
    type: "internal" | "external" | "anchor"
    slug?: string
    url?: string
    anchor?: string
  }
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  blocks: Block[]
  category: string
}

export interface LinkData {
  id: string
  sourcePageId: string
  sourceBlockId: string
  targetPageSlug?: string
  targetUrl?: string
  linkType: "internal" | "external" | "anchor"
  anchor?: string
  createdAt: Date
}
