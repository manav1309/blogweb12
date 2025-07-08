import mongoose from "mongoose"

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "editor"],
      default: "editor",
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

// Page Schema
const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: [mongoose.Schema.Types.Mixed],
    template: { type: String, default: "custom" },
    published: { type: Boolean, default: false },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seo: {
      title: String,
      description: String,
      keywords: String,
      image: String,
    },
    linkedPages: [
      {
        sourceBlockId: mongoose.Schema.Types.ObjectId,
        targetPageSlug: String,
        linkType: { type: String, enum: ["internal", "external", "anchor"] },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Backup Schema
const backupSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  downloadUrl: String,
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const Page = mongoose.models.Page || mongoose.model("Page", pageSchema)
export const Backup = mongoose.models.Backup || mongoose.model("Backup", backupSchema)

export type User = {
  id: string
  name: string
  email: string
  role: "super-admin" | "editor"
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export type Page = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: any[]
  template: string
  published: boolean
  authorId: string
  seo?: {
    title?: string
    description?: string
    keywords?: string
    image?: string
  }
  linkedPages: Array<{
    sourceBlockId: string
    targetPageSlug: string
    linkType: "internal" | "external" | "anchor"
  }>
  createdAt: Date
  updatedAt: Date
}

export type Backup = {
  id: string
  filename: string
  size: number
  downloadUrl?: string
  createdAt: Date
}
