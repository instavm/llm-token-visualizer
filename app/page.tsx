import TokenVisualizer from "@/components/token-visualizer"
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">LLM Token Visualizer</h1>
        <p className="text-muted-foreground mb-8">
          Visualize how many tokens are in different text lengths by adjusting the sliders below.
        </p>
        <TokenVisualizer />
      </div>
      <Analytics />
    </main>
  )
}

