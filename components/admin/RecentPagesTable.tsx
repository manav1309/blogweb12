"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Page {
  _id: string
  title: string
  slug: string
  published: boolean
  updatedAt: string
}

interface RecentPagesTableProps {
  pages: Page[]
}

export default function RecentPagesTable({ pages }: RecentPagesTableProps) {
  return (
    <div className="space-y-2">
      {pages.map((page) => (
        <div key={page._id} className="flex items-center justify-between p-2 hover:bg-accent rounded">
          <div className="flex-1">
            <div className="font-medium text-sm">{page.title}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={page.published ? "default" : "secondary"} className="text-xs">
              {page.published ? "Published" : "Draft"}
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/pages/${page._id}/edit`}>
                <Edit className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>
      ))}

      {pages.length === 0 && <div className="text-center py-4 text-muted-foreground text-sm">No recent pages</div>}
    </div>
  )
}
