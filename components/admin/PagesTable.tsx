"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Page {
  _id: string
  title: string
  slug: string
  published: boolean
  template: string
  authorId: { name: string }
  updatedAt: string
}

interface PagesTableProps {
  pages: Page[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function PagesTable({ pages, pagination }: PagesTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page._id}>
              <TableCell>
                <div>
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm text-muted-foreground">/{page.slug}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={page.published ? "default" : "secondary"}>
                  {page.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{page.template}</TableCell>
              <TableCell>{page.authorId?.name}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${page.slug}`} target="_blank">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/pages/${page._id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No pages found. Create your first page to get started.
        </div>
      )}
    </div>
  )
}
