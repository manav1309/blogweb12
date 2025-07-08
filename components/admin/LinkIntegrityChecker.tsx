"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

interface LinkCheck {
  pageTitle: string
  pageSlug: string
  linkType: string
  target: string
  status: "working" | "broken" | "checking"
  error?: string
}

export default function LinkIntegrityChecker() {
  const [links, setLinks] = useState<LinkCheck[]>([])
  const [checking, setChecking] = useState(false)

  const checkLinks = async () => {
    setChecking(true)
    try {
      const response = await fetch("/api/admin/check-links")
      const data = await response.json()
      setLinks(data.links || [])
    } catch (error) {
      console.error("Error checking links:", error)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkLinks()
  }, [])

  const brokenLinks = links.filter((link) => link.status === "broken")
  const workingLinks = links.filter((link) => link.status === "working")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm">{workingLinks.length} working</span>
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm">{brokenLinks.length} broken</span>
        </div>
        <Button variant="outline" size="sm" onClick={checkLinks} disabled={checking}>
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? "animate-spin" : ""}`} />
          Check Links
        </Button>
      </div>

      {brokenLinks.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-red-600">Broken Links</h4>
          {brokenLinks.slice(0, 5).map((link, index) => (
            <div key={index} className="p-2 bg-red-50 rounded text-sm">
              <div className="font-medium">{link.pageTitle}</div>
              <div className="text-muted-foreground">{link.target}</div>
              {link.error && <div className="text-red-600 text-xs">{link.error}</div>}
            </div>
          ))}
          {brokenLinks.length > 5 && (
            <div className="text-xs text-muted-foreground">+{brokenLinks.length - 5} more broken links</div>
          )}
        </div>
      )}

      {brokenLinks.length === 0 && !checking && (
        <div className="text-center py-4 text-green-600 text-sm">All links are working correctly!</div>
      )}
    </div>
  )
}
