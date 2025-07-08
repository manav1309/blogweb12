"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, Hash, FileText } from "lucide-react"

interface LinkData {
  type: "internal" | "external" | "anchor"
  slug?: string
  url?: string
  anchor?: string
}

interface LinkSelectorProps {
  blockId?: string
  pageId?: string
  currentLink?: LinkData
  onLinkSelect?: (link: LinkData | null) => void
  onLinkUpdate?: () => void
  onClose: () => void
}

export default function LinkSelector({
  blockId,
  pageId,
  currentLink,
  onLinkSelect,
  onLinkUpdate,
  onClose,
}: LinkSelectorProps) {
  const [linkType, setLinkType] = useState<"internal" | "external" | "anchor">(currentLink?.type || "internal")
  const [searchTerm, setSearchTerm] = useState("")
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: currentLink?.slug || "",
    url: currentLink?.url || "",
    anchor: currentLink?.anchor || "",
  })

  useEffect(() => {
    if (linkType === "internal") {
      fetchPages()
    }
  }, [linkType, searchTerm])

  const fetchPages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pages?search=${searchTerm}&limit=20`)
      const data = await response.json()
      setPages(data.data || [])
    } catch (error) {
      console.error("Error fetching pages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    let linkData: LinkData | null = null

    if (linkType === "internal" && formData.slug) {
      linkData = { type: "internal", slug: formData.slug }
    } else if (linkType === "external" && formData.url) {
      linkData = { type: "external", url: formData.url }
    } else if (linkType === "anchor" && formData.anchor) {
      linkData = { type: "anchor", anchor: formData.anchor }
    }

    onLinkSelect?.(linkData)
    onClose()
  }

  const handleRemove = () => {
    onLinkSelect?.(null)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>

        <Tabs value={linkType} onValueChange={(value) => setLinkType(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="internal">
              <FileText className="w-4 h-4 mr-2" />
              Internal Page
            </TabsTrigger>
            <TabsTrigger value="external">
              <ExternalLink className="w-4 h-4 mr-2" />
              External URL
            </TabsTrigger>
            <TabsTrigger value="anchor">
              <Hash className="w-4 h-4 mr-2" />
              Anchor Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="space-y-4">
            <div className="space-y-2">
              <Label>Search Pages</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a page..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-4">Loading pages...</div>
              ) : pages.length > 0 ? (
                pages.map((page) => (
                  <div
                    key={page._id}
                    className={`p-3 border rounded cursor-pointer hover:bg-accent ${
                      formData.slug === page.slug ? "bg-accent" : ""
                    }`}
                    onClick={() => setFormData({ ...formData, slug: page.slug })}
                  >
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-muted-foreground">/{page.slug}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No pages found</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="external" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="external-url">External URL</Label>
              <Input
                id="external-url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="anchor" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anchor-id">Anchor ID</Label>
              <Input
                id="anchor-id"
                placeholder="section-name"
                value={formData.anchor}
                onChange={(e) => setFormData({ ...formData, anchor: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Links to an element with this ID on the current page</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <div>
            {currentLink && (
              <Button variant="destructive" onClick={handleRemove}>
                Remove Link
              </Button>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Link</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
