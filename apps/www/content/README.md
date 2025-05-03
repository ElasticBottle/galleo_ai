# Managing Content

This directory contains all the content for the Galleo website, organized by type (e.g., insights, blog posts, etc.).

## Adding New Articles

1. Create a new `.mdx` file in the `insights` directory
2. Name the file using kebab-case (e.g., `my-new-article.mdx`)
3. Add the required frontmatter at the top of the file:

```mdx
---
title: "Your Article Title"
description: "A brief description of your article (will appear in cards and meta tags)"
date: "2024-03-06"
image: "URL to your header image"
category: "CATEGORY NAME"
readingTime: "X min read"
author: "Author Name"
---

Your article content here...
```

## Writing Content

- Use standard Markdown syntax
- Headers use # symbols (#, ##, ###)
- Bold text uses **double asterisks**
- Lists use - or 1. for numbered lists
- Code blocks use triple backticks ```
- Images can be added using ![alt text](image-url)

## Example Article Structure

```mdx
---
title: "Getting Started with Legal Tech"
description: "Learn how to effectively integrate legal technology into your workflow"
date: "2024-03-06"
image: "https://example.com/image.jpg"
category: "LEGAL TECH"
readingTime: "5 min read"
author: "Galleo Team"
---

# Main Title

Introduction paragraph...

## Section Title

Content...

### Subsection

- List item 1
- List item 2

## Another Section

More content...
```

## Editing Articles

1. Find the article file in the `insights` directory
2. Edit the frontmatter or content as needed
3. Save the file
4. The changes will be reflected automatically in development
5. Commit and push changes to deploy to production

## Removing Articles

1. Simply delete the `.mdx` file from the `insights` directory
2. Commit and push the changes

## Images

- Use high-quality images (recommended size: 1200x800px)
- Host images on a CDN or in the public directory
- Use descriptive alt text for accessibility

## Best Practices

1. Keep titles concise and descriptive
2. Write clear meta descriptions (150-160 characters)
3. Use appropriate categories consistently
4. Include relevant images
5. Structure content with clear headings
6. Break up text with lists and subheadings
7. Review content for accuracy before publishing 