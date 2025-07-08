import connectDB from "./connection"
import { Page } from "./models"

export async function getPages(
  options: {
    search?: string
    status?: string
    template?: string
    page?: number
    limit?: number
  } = {},
) {
  await connectDB()

  const { search, status, template, page = 1, limit = 10 } = options

  const query: any = {}

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { excerpt: { $regex: search, $options: "i" } }]
  }

  if (status === "published") {
    query.published = true
  } else if (status === "draft") {
    query.published = false
  }

  if (template) {
    query.template = template
  }

  const skip = (page - 1) * limit
  const total = await Page.countDocuments(query)
  const pages = await Page.find(query)
    .populate("authorId", "name email")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return {
    data: pages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getPageById(id: string) {
  await connectDB()
  return await Page.findById(id).populate("authorId", "name email").lean()
}

export async function getPageBySlug(slug: string) {
  await connectDB()
  return await Page.findOne({ slug }).populate("authorId", "name email").lean()
}

export async function getPublishedPages() {
  await connectDB()
  return await Page.find({ published: true }).populate("authorId", "name email").sort({ updatedAt: -1 }).lean()
}

export async function getAllPageSlugs() {
  await connectDB()
  const pages = await Page.find({ published: true }, "slug").lean()
  return pages.map((page) => page.slug)
}

export async function createPage(data: any) {
  await connectDB()
  const page = new Page(data)
  return await page.save()
}

export async function updatePage(id: string, data: any) {
  await connectDB()
  return await Page.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function deletePage(id: string) {
  await connectDB()
  const result = await Page.findByIdAndDelete(id)
  return !!result
}

export async function getPageStats() {
  await connectDB()

  const [totalPages, publishedPages, totalLinks, brokenLinks, totalUsers, activeUsers] = await Promise.all([
    Page.countDocuments(),
    Page.countDocuments({ published: true }),
    Page.aggregate([{ $unwind: "$linkedPages" }, { $count: "total" }]).then((result) => result[0]?.total || 0),
    // This would need a more complex query to check for broken links
    0,
    // These would need User model queries
    0,
    0,
  ])

  return {
    totalPages,
    publishedPages,
    totalLinks,
    brokenLinks,
    totalUsers,
    activeUsers,
    lastBackup: "Today",
  }
}

export async function getRecentPages(limit = 5) {
  await connectDB()
  return await Page.find().populate("authorId", "name email").sort({ updatedAt: -1 }).limit(limit).lean()
}
