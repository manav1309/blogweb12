import { Suspense } from "react"
import { getPublishedPages } from "@/lib/db/pages"
import PageRenderer from "@/components/PageRenderer"
import { Skeleton } from "@/components/ui/skeleton"

export default async function HomePage() {
  const pages = await getPublishedPages()
  const homePage = pages.find((page) => page.slug === "home") || pages[0]

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your CMS</h1>
          <p className="text-muted-foreground">No pages found. Create your first page in the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageRenderer page={homePage} />
    </Suspense>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-4 p-8">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
