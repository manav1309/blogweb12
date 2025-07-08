import { notFound } from "next/navigation"
import { getPageById } from "@/lib/db/pages"
import { getPageTemplates } from "@/lib/templates"
import PageEditor from "@/components/admin/PageEditor"

interface EditPageProps {
  params: { id: string }
}

export default async function EditPagePage({ params }: EditPageProps) {
  const [page, templates] = await Promise.all([getPageById(params.id), getPageTemplates()])

  if (!page) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Page</h1>
        <p className="text-muted-foreground">Editing: {page.title}</p>
      </div>

      <PageEditor page={page} templates={templates} />
    </div>
  )
}
