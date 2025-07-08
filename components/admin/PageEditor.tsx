"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Eye } from "lucide-react"
import type { Page, PageTemplate } from "@/lib/types"
import BlockEditor from "./BlockEditor"
import SEOEditor from "./SEOEditor"
import LinkSelector from "./LinkSelector"
import { toast } from "sonner"

interface PageEditorProps {
  page?: Page
  templates: PageTemplate[]
}

export default function PageEditor({ page, templates }: PageEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    excerpt: page?.excerpt || "",
    content: page?.content || [],
    template: page?.template || "custom",
    published: page?.published || false,
    seo: page?.seo || {
      title: "",
      description: "",
      keywords: "",
      image: "",
    },
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !page ? generateSlug(title) : prev.slug,
    }))
  }

  const handleTemplateChange = (template: string) => {
    const selectedTemplate = templates.find((t) => t.id === template)
    if (selectedTemplate) {
      setFormData((prev) => ({
        ...prev,
        template,
        content: selectedTemplate.blocks,
      }))
    }
  }

  const handleSave = async (publish = false) => {
    setLoading(true)
    try {
      const payload = {
        ...formData,
        published: publish || formData.published,
      }

      const url = page ? `/api/pages/${page.id}` : "/api/pages"
      const method = page ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to save page")
      }

      const savedPage = await response.json()

      toast.success(publish ? "Page published successfully!" : "Page saved successfully!")

      if (!page) {
        router.push(`/admin/pages/${savedPage.id}/edit`)
      }
    } catch (error) {
      console.error("Error saving page:", error)
      toast.error("Failed to save page")
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    const previewUrl = page ? `/${page.slug}?preview=true` : "#"
    window.open(previewUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Input
            placeholder="Page title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold border-none p-0 h-auto"
          />
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>/{formData.slug}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newSlug = prompt("Enter new slug:", formData.slug)
                if (newSlug) {
                  setFormData((prev) => ({ ...prev, slug: generateSlug(newSlug) }))
                }
              }}
            >
              Edit
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => handleSave(false)} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={loading}>
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {!page && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.template} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <BlockEditor
            blocks={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of the page"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(published) => setFormData((prev) => ({ ...prev, published }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOEditor seo={formData.seo} onChange={(seo) => setFormData((prev) => ({ ...prev, seo }))} />
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <LinkSelector
            pageId={page?.id}
            onLinkUpdate={() => {
              // Refresh page data to show updated links
              router.refresh()
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
