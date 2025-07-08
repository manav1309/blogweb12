"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export default function PageFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to first page when filtering
    router.push(`/admin/pages?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/admin/pages")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchParams.get("search") || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(value) => updateFilter("status", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("template") || "all"}
        onValueChange={(value) => updateFilter("template", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Templates</SelectItem>
          <SelectItem value="blog">Blog</SelectItem>
          <SelectItem value="article">Article</SelectItem>
          <SelectItem value="poetry">Poetry</SelectItem>
          <SelectItem value="landing">Landing</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={clearFilters}>
        <X className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  )
}
