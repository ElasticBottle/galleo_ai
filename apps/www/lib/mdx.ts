import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface ContentMetadata {
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: string;
  readingTime?: string;
  author?: string;
}

export interface Content {
  slug: string;
  content: string;
  metadata: ContentMetadata;
}

export async function getAllContent(type: string): Promise<Content[]> {
  const contentDirectory = path.join(process.cwd(), "content", type);

  // Create directory if it doesn't exist
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }

  const filenames = fs.readdirSync(contentDirectory);
  const allContent = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(contentDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug: filename.replace(".mdx", ""),
        content,
        metadata: data as ContentMetadata,
      };
    })
    .sort((a, b) => {
      if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
        return -1;
      }
      return 1;
    });

  return allContent;
}

export function getContentBySlug(type: string, slug: string): Promise<Content> {
  const filePath = path.join(process.cwd(), "content", type, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return Promise.resolve({
    slug,
    content,
    metadata: data as ContentMetadata,
  });
}
