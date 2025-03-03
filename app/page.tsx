'use client';  // Designate this component as a client component

import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import TokenVisualizer from "@/components/token-visualizer"
import { Analytics } from "@vercel/analytics/react"

// Helper function to format star count
function formatStarCount(starCount: number): string {
  if (starCount < 1000) return starCount.toString();
  return (starCount / 1000).toFixed(1) + 'k';
}

export default function Home() {
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    // Fetch count from GitHub's API
    fetch('https://api.github.com/repos/BandarLabs/llm-token-visualizer')
      .then(response => response.json())
      .then(data => setStarCount(data.stargazers_count))
      .catch(error => console.error('Error fetching GitHub star count:', error));
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold mb-2 flex-grow">LLM Token Visualizer</h1>
          <Link
            href="https://github.com/BandarLabs/llm-token-visualizer"
            className="flex items-center gap-2 text-sm font-medium text-black transition-transform hover:translate-y-[-2px] hover:text-orange-600"
          >
            <FaGithub className="h-5 w-5" />
            GitHub
          </Link>
          <span className="flex items-center gap-1 text-sm font-medium text-black ml-4">
            <span className="text-amber-400">★</span>
            {formatStarCount(starCount)}
          </span>
        </div>
        <p className="text-muted-foreground mb-8">
          Visualize how many tokens are in different text lengths by adjusting the sliders below.
        </p>
        <TokenVisualizer />
      </div>
      <Analytics />
    </main>
  );
}