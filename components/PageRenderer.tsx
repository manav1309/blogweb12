import type { Page } from "@/lib/db/models"
import BlockRenderer from "./BlockRenderer"

interface PageRendererProps {
  page: Page
}

export default function PageRenderer({ page }: PageRendererProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {page.content.map((block, index) => (
          <BlockRenderer key={block.id || index} block={block} />
        ))}
      </div>
    </div>
  )
}
