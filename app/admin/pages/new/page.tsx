import PageEditor from "@/components/admin/PageEditor"
import { getPageTemplates } from "@/lib/templates"

export default async function NewPagePage() {
  const templates = await getPageTemplates()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Page</h1>
        <p className="text-muted-foreground">Choose a template and start building your page</p>
      </div>

      <PageEditor templates={templates} />
    </div>
  )
}
