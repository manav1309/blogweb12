import { getPages } from "@/lib/db/pages"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import PagesTable from "@/components/admin/PagesTable"
import PageFilters from "@/components/admin/PageFilters"

interface PageProps {
  searchParams: {
    search?: string
    status?: string
    template?: string
    page?: string
  }
}

export default async function PagesPage({ searchParams }: PageProps) {
  const pages = await getPages({
    search: searchParams.search,
    status: searchParams.status,
    template: searchParams.template,
    page: Number.parseInt(searchParams.page || "1"),
    limit: 10,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages</p>
        </div>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
        </Link>
      </div>

      <PageFilters />
      <PagesTable pages={pages.data} pagination={pages.pagination} />
    </div>
  )
}
