"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Trash2, Type, ImageIcon, List, Code, Minus, Space, MousePointer, LinkIcon } from "lucide-react"
import type { Block } from "@/lib/types"
import LinkSelector from "./LinkSelector"

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

const blockTypes = [
  { value: "heading", label: "Heading", icon: Type },
  { value: "paragraph", label: "Paragraph", icon: Type },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "button", label: "Button", icon: MousePointer },
  { value: "list", label: "List", icon: List },
  { value: "code", label: "Code", icon: Code },
  { value: "divider", label: "Divider", icon: Minus },
  { value: "spacer", label: "Spacer", icon: Space },
]

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showLinkSelector, setShowLinkSelector] = useState<string | null>(null)

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: type as any,
      content:
        type === "heading"
          ? "New Heading"
          : type === "paragraph"
            ? "New paragraph content..."
            : type === "button"
              ? "Button Text"
              : type === "list"
                ? ""
                : type === "code"
                  ? "// Your code here"
                  : "",
      ...(type === "heading" && { level: 1 }),
      ...(type === "image" && {
        src: "/placeholder.svg?height=400&width=800",
        alt: "Image description",
        width: 800,
        height: 400,
      }),
      ...(type === "button" && { variant: "default", size: "default" }),
      ...(type === "list" && { ordered: false, items: ["Item 1", "Item 2", "Item 3"] }),
      ...(type === "code" && { language: "javascript" }),
      ...(type === "spacer" && { height: 4 }),
    }

    onChange([...blocks, newBlock])
  }

  const updateBlock = (index: number, updates: Partial<Block>) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], ...updates }
    onChange(newBlocks)
  }

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    onChange(newBlocks)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newBlocks = Array.from(blocks)
    const [reorderedItem] = newBlocks.splice(result.source.index, 1)
    newBlocks.splice(result.destination.index, 0, reorderedItem)

    onChange(newBlocks)
  }

  const renderBlockEditor = (block: Block, index: number) => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Select
                value={block.level?.toString() || "1"}
                onValueChange={(value) => updateBlock(index, { level: Number.parseInt(value) })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Anchor ID (optional)"
                value={block.anchor || ""}
                onChange={(e) => updateBlock(index, { anchor: e.target.value })}
                className="flex-1"
              />
            </div>
            <Input
              value={block.content || ""}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              placeholder="Heading text"
            />
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Anchor ID (optional)"
              value={block.anchor || ""}
              onChange={(e) => updateBlock(index, { anchor: e.target.value })}
            />
            <Textarea
              value={block.content || ""}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              placeholder="Paragraph content (HTML allowed)"
              rows={4}
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={block.src || ""}
              onChange={(e) => updateBlock(index, { src: e.target.value })}
            />
            <Input
              placeholder="Alt text"
              value={block.alt || ""}
              onChange={(e) => updateBlock(index, { alt: e.target.value })}
            />
            <Input
              placeholder="Caption (optional)"
              value={block.caption || ""}
              onChange={(e) => updateBlock(index, { caption: e.target.value })}
            />
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Width"
                value={block.width || ""}
                onChange={(e) => updateBlock(index, { width: Number.parseInt(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Height"
                value={block.height || ""}
                onChange={(e) => updateBlock(index, { height: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-2">
            <Input
              value={block.content || ""}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              placeholder="Button text"
            />
            <div className="flex space-x-2">
              <Select
                value={block.variant || "default"}
                onValueChange={(value) => updateBlock(index, { variant: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
              <Select value={block.size || "default"} onValueChange={(value) => updateBlock(index, { size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "list":
        return (
          <div className="space-y-2">
            <Select
              value={block.ordered ? "ordered" : "unordered"}
              onValueChange={(value) => updateBlock(index, { ordered: value === "ordered" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unordered">Bullet List</SelectItem>
                <SelectItem value="ordered">Numbered List</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={block.items?.join("\n") || ""}
              onChange={(e) => updateBlock(index, { items: e.target.value.split("\n").filter((item) => item.trim()) })}
              placeholder="Enter list items (one per line)"
              rows={4}
            />
          </div>
        )

      case "code":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Language (e.g., javascript, python)"
              value={block.language || ""}
              onChange={(e) => updateBlock(index, { language: e.target.value })}
            />
            <Textarea
              value={block.content || ""}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              placeholder="Code content"
              rows={6}
              className="font-mono"
            />
          </div>
        )

      case "spacer":
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Height (in rem units)"
              value={block.height || ""}
              onChange={(e) => updateBlock(index, { height: Number.parseInt(e.target.value) })}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {blockTypes.map((blockType) => {
          const Icon = blockType.icon
          return (
            <Button key={blockType.value} variant="outline" size="sm" onClick={() => addBlock(blockType.value)}>
              <Icon className="w-4 h-4 mr-2" />
              {blockType.label}
            </Button>
          )
        })}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id || index} draggableId={block.id || index.toString()} index={index}>
                  {(provided) => (
                    <Card ref={provided.innerRef} {...provided.draggableProps} className="relative">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          </div>
                          <span className="font-medium capitalize">{block.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLinkSelector(block.id || index.toString())}
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteBlock(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {renderBlockEditor(block, index)}
                        {block.link && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>Linked to:</strong>{" "}
                            {block.link.type === "internal"
                              ? `/${block.link.slug}`
                              : block.link.type === "external"
                                ? block.link.url
                                : `#${block.link.anchor}`}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showLinkSelector && (
        <LinkSelector
          blockId={showLinkSelector}
          currentLink={blocks.find((b) => (b.id || blocks.indexOf(b).toString()) === showLinkSelector)?.link}
          onLinkSelect={(link) => {
            const blockIndex = blocks.findIndex((b) => (b.id || blocks.indexOf(b).toString()) === showLinkSelector)
            if (blockIndex !== -1) {
              updateBlock(blockIndex, { link })
            }
            setShowLinkSelector(null)
          }}
          onClose={() => setShowLinkSelector(null)}
        />
      )}
    </div>
  )
}
