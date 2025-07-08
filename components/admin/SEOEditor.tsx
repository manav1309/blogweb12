"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
}

interface SEOEditorProps {
  seo: SEOData
  onChange: (seo: SEOData) => void
}

export default function SEOEditor({ seo, onChange }: SEOEditorProps) {
  const updateSEO = (field: keyof SEOData, value: string) => {
    onChange({
      ...seo,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seo-title">Meta Title</Label>
          <Input
            id="seo-title"
            placeholder="Page title for search engines"
            value={seo.title || ""}
            onChange={(e) => updateSEO("title", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{seo.title?.length || 0}/60 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-description">Meta Description</Label>
          <Textarea
            id="seo-description"
            placeholder="Brief description for search results"
            value={seo.description || ""}
            onChange={(e) => updateSEO("description", e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">{seo.description?.length || 0}/160 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-keywords">Keywords</Label>
          <Input
            id="seo-keywords"
            placeholder="keyword1, keyword2, keyword3"
            value={seo.keywords || ""}
            onChange={(e) => updateSEO("keywords", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo-image">Social Media Image</Label>
          <Input
            id="seo-image"
            placeholder="https://example.com/image.jpg"
            value={seo.image || ""}
            onChange={(e) => updateSEO("image", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
