"use client";
import { useEffect, useState } from "react";
import { markdownToHtml } from "../utils/markdown";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    markdownToHtml(content).then(setHtml);
  }, [content]);

  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
