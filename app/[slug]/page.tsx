import { notFound } from "next/navigation"
import { getPageBySlug, getAllPageSlugs } from "@/lib/db/pages"
import PageRenderer from "@/components/PageRenderer"
import type { Metadata } from "next"

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
    keywords: page.seo?.keywords,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.excerpt,
      images: page.seo?.image ? [page.seo.image] : undefined,
    },
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)

  if (!page || !page.published) {
    notFound()
  }

  return <PageRenderer page={page} />
}
