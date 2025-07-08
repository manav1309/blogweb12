import type React from "react"
import type { Block } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { JSX } from "react"

interface BlockRendererProps {
  block: Block
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  const renderLink = (children: React.ReactNode, link?: any) => {
    if (!link) return children

    if (link.type === "internal") {
      return <Link href={`/${link.slug}`}>{children}</Link>
    } else if (link.type === "external") {
      return (
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    } else if (link.type === "anchor") {
      return <a href={`#${link.anchor}`}>{children}</a>
    }

    return children
  }

  switch (block.type) {
    case "heading":
      const HeadingTag = `h${block.level || 1}` as keyof JSX.IntrinsicElements
      return (
        <HeadingTag
          className={`font-bold mb-4 ${
            block.level === 1 ? "text-4xl" : block.level === 2 ? "text-3xl" : block.level === 3 ? "text-2xl" : "text-xl"
          }`}
          id={block.anchor}
        >
          {renderLink(block.content, block.link)}
        </HeadingTag>
      )

    case "paragraph":
      return (
        <p className="mb-4 leading-relaxed" id={block.anchor}>
          {renderLink(<span dangerouslySetInnerHTML={{ __html: block.content }} />, block.link)}
        </p>
      )

    case "image":
      return (
        <div className="mb-6" id={block.anchor}>
          {renderLink(
            <Image
              src={block.src || "/placeholder.svg"}
              alt={block.alt || ""}
              width={block.width || 800}
              height={block.height || 400}
              className="rounded-lg shadow-md"
            />,
            block.link,
          )}
          {block.caption && <p className="text-sm text-muted-foreground mt-2 text-center">{block.caption}</p>}
        </div>
      )

    case "button":
      return (
        <div className="mb-4" id={block.anchor}>
          {renderLink(
            <Button variant={block.variant || "default"} size={block.size || "default"}>
              {block.content}
            </Button>,
            block.link,
          )}
        </div>
      )

    case "list":
      const ListTag = block.ordered ? "ol" : "ul"
      return (
        <ListTag className="mb-4 ml-6" id={block.anchor}>
          {block.items.map((item: string, index: number) => (
            <li key={index} className="mb-1">
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ListTag>
      )

    case "code":
      return (
        <pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto" id={block.anchor}>
          <code className={`language-${block.language || "text"}`}>{block.content}</code>
        </pre>
      )

    case "divider":
      return <hr className="my-8 border-border" id={block.anchor} />

    case "spacer":
      return <div className={`h-${block.height || 4}`} id={block.anchor} />

    default:
      return null
  }
}
