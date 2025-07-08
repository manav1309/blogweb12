import type { PageTemplate } from "./types"

export async function getPageTemplates(): Promise<PageTemplate[]> {
  return [
    {
      id: "blog",
      name: "Blog Post",
      description: "Standard blog post layout with title, content, and metadata",
      category: "Content",
      blocks: [
        {
          type: "heading",
          level: 1,
          content: "Your Blog Post Title",
        },
        {
          type: "paragraph",
          content: "Write your blog post content here. You can add multiple paragraphs, images, and other elements.",
        },
        {
          type: "image",
          src: "/placeholder.svg?height=400&width=800",
          alt: "Featured image",
          caption: "Add a caption for your image",
        },
        {
          type: "paragraph",
          content: "Continue your content here...",
        },
      ],
    },
    {
      id: "article",
      name: "Article",
      description: "Long-form article with sections and subsections",
      category: "Content",
      blocks: [
        {
          type: "heading",
          level: 1,
          content: "Article Title",
        },
        {
          type: "paragraph",
          content: "Article introduction and overview.",
        },
        {
          type: "heading",
          level: 2,
          content: "Section 1",
        },
        {
          type: "paragraph",
          content: "Section content goes here.",
        },
        {
          type: "heading",
          level: 2,
          content: "Section 2",
        },
        {
          type: "paragraph",
          content: "More section content.",
        },
      ],
    },
    {
      id: "poetry",
      name: "Poetry",
      description: "Poetry layout with centered text and elegant spacing",
      category: "Creative",
      blocks: [
        {
          type: "heading",
          level: 1,
          content: "Poem Title",
        },
        {
          type: "paragraph",
          content: "First stanza of your poem<br>Line two of first stanza<br>Line three of first stanza",
        },
        {
          type: "spacer",
        },
        {
          type: "paragraph",
          content: "Second stanza<br>Line two of second stanza<br>Line three of second stanza",
        },
      ],
    },
    {
      id: "landing",
      name: "Landing Page",
      description: "Marketing landing page with hero section and call-to-action",
      category: "Marketing",
      blocks: [
        {
          type: "heading",
          level: 1,
          content: "Welcome to Our Amazing Product",
        },
        {
          type: "paragraph",
          content: "Discover the power of our solution and transform your business today.",
        },
        {
          type: "button",
          content: "Get Started",
          variant: "default",
          size: "lg",
        },
        {
          type: "image",
          src: "/placeholder.svg?height=400&width=800",
          alt: "Product showcase",
        },
        {
          type: "heading",
          level: 2,
          content: "Why Choose Us?",
        },
        {
          type: "list",
          ordered: false,
          items: [
            "Feature 1: Amazing capability",
            "Feature 2: Outstanding performance",
            "Feature 3: Excellent support",
          ],
        },
      ],
    },
    {
      id: "custom",
      name: "Blank Page",
      description: "Start with a blank canvas",
      category: "Basic",
      blocks: [
        {
          type: "heading",
          level: 1,
          content: "Page Title",
        },
        {
          type: "paragraph",
          content: "Start writing your content here...",
        },
      ],
    },
  ]
}
