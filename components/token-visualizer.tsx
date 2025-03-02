"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"
import { useDebounce } from "@/lib/hooks"

// Approximate tokens per word (this is a rough estimate)
const TOKENS_PER_WORD = 1.3
// Simple repeating text for better performance
const SAMPLE_WORD = "word "

// Token milestones for color coding
const TOKEN_MILESTONES = [
  { threshold: 512, color: "text-green-500" },
  { threshold: 4000, color: "text-blue-500" },
  { threshold: 8000, color: "text-yellow-500" },
  { threshold: 16000, color: "text-purple-500" },
  { threshold: 32000, color: "text-pink-500" },
  { threshold: 128000, color: "text-red-500" },
  { threshold: Number.POSITIVE_INFINITY, color: "text-gray-500" },
]

export default function TokenVisualizer() {
  const [inputTokens, setInputTokens] = useState(1000)
  const [outputTokens, setOutputTokens] = useState(1000)
  const [activeTab, setActiveTab] = useState("input")

  // Use debounced values to prevent excessive re-renders
  const debouncedInputTokens = useDebounce(inputTokens, 300)
  const debouncedOutputTokens = useDebounce(outputTokens, 300)

  const [inputFontSize, setInputFontSize] = useState(16)
  const [outputFontSize, setOutputFontSize] = useState(16)

  // Pre-generated text cache
  const textCache = useRef<Record<number, string>>({})

  // Generate text based on token count with caching
  const generateText = useCallback((tokenCount: number) => {
    // Return from cache if available
    if (textCache.current[tokenCount]) {
      return textCache.current[tokenCount]
    }

    const wordCount = Math.floor(tokenCount / TOKENS_PER_WORD)
    let result = ""

    // Use simple repeating pattern for better performance
    const chunkSize = 1000 // Generate text in chunks to avoid long-running loops
    const fullChunks = Math.floor(wordCount / chunkSize)
    const remainingWords = wordCount % chunkSize

    const chunk = SAMPLE_WORD.repeat(chunkSize)

    for (let i = 0; i < fullChunks; i++) {
      result += chunk
    }

    result += SAMPLE_WORD.repeat(remainingWords)

    textCache.current[tokenCount] = result
    return result
  }, [])

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Calculate appropriate font size based on token count
  useEffect(() => {
    const calculateFontSize = (tokenCount: number) => {
      // Base font size calculation - this is a heuristic that can be adjusted
      const baseFontSize = 16

      if (tokenCount <= 100) return baseFontSize
      if (tokenCount <= 1000) return baseFontSize * 0.8
      if (tokenCount <= 10000) return baseFontSize * 0.6
      if (tokenCount <= 100000) return baseFontSize * 0.4
      if (tokenCount <= 1000000) return baseFontSize * 0.2
      return baseFontSize * 0.1
    }

    setInputFontSize(calculateFontSize(debouncedInputTokens))
    setOutputFontSize(calculateFontSize(debouncedOutputTokens))
  }, [debouncedInputTokens, debouncedOutputTokens])

  // Pre-generate text for common token counts
  useEffect(() => {
    const presetValues = [512, 4000, 8000, 16000, 32000, 128000, 1000000]
    presetValues.forEach((value) => {
      // Generate in the background to avoid blocking the UI
      setTimeout(() => {
        if (!textCache.current[value]) {
          generateText(value)
        }
      }, 0)
    })
  }, [generateText])

  // Token count presets
  const presets = [
    { label: "512", value: 512, color: "bg-green-500 hover:bg-green-600" },
    { label: "4K", value: 4000, color: "bg-blue-500 hover:bg-blue-600" },
    { label: "8K", value: 8000, color: "bg-yellow-500 hover:bg-yellow-600" },
    { label: "16K", value: 16000, color: "bg-purple-500 hover:bg-purple-600" },
    { label: "32K", value: 32000, color: "bg-pink-500 hover:bg-pink-600" },
    { label: "128K", value: 128000, color: "bg-red-500 hover:bg-red-600" },
    { label: "1M", value: 1000000, color: "bg-gray-500 hover:bg-gray-600" },
  ]

  // Function to render color-coded text
  const renderColorCodedText = (tokenCount: number) => {
    let text = generateText(tokenCount)
    let remainingTokens = tokenCount
    const result = []

    for (const milestone of TOKEN_MILESTONES) {
      const tokensInThisColor = Math.min(remainingTokens, milestone.threshold)
      const wordsInThisColor = Math.floor(tokensInThisColor / TOKENS_PER_WORD)
      const coloredText = text.split(" ").slice(0, wordsInThisColor).join(" ")

      result.push(
        <span key={milestone.threshold} className={milestone.color}>
          {coloredText + " "}
        </span>,
      )

      text = text.split(" ").slice(wordsInThisColor).join(" ")
      remainingTokens -= tokensInThisColor

      if (remainingTokens <= 0) break
    }

    return result
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Input Tokens</h2>
                <Badge variant="outline" className="text-sm">
                  {formatNumber(inputTokens)} tokens
                </Badge>
              </div>
              <Slider
                value={[inputTokens]}
                min={100}
                max={1000000}
                step={100}
                onValueChange={(value) => setInputTokens(value[0])}
                className="mb-6"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((preset) => (
                  <Badge
                    key={preset.value}
                    variant={inputTokens === preset.value ? "default" : "outline"}
                    className={`cursor-pointer ${inputTokens === preset.value ? preset.color + " text-white" : ""}`}
                    onClick={() => setInputTokens(preset.value)}
                  >
                    {preset.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Output Tokens</h2>
                <Badge variant="outline" className="text-sm">
                  {formatNumber(outputTokens)} tokens
                </Badge>
              </div>
              <Slider
                value={[outputTokens]}
                min={100}
                max={1000000}
                step={100}
                onValueChange={(value) => setOutputTokens(value[0])}
                className="mb-6"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((preset) => (
                  <Badge
                    key={preset.value}
                    variant={outputTokens === preset.value ? "default" : "outline"}
                    className={`cursor-pointer ${outputTokens === preset.value ? preset.color + " text-white" : ""}`}
                    onClick={() => setOutputTokens(preset.value)}
                  >
                    {preset.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <InfoIcon className="h-4 w-4" />
        <p>
          The text below represents approximately how much content fits in the selected token counts. Colors indicate
          different token milestones.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Input Visualization</TabsTrigger>
          <TabsTrigger value="output">Output Visualization</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="mt-4">
          <Card>
            <CardContent className="p-4 h-[60vh] overflow-auto">
              <div style={{ fontSize: `${inputFontSize}px` }} className="whitespace-pre-wrap">
                {renderColorCodedText(debouncedInputTokens)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="output" className="mt-4">
          <Card>
            <CardContent className="p-4 h-[60vh] overflow-auto">
              <div style={{ fontSize: `${outputFontSize}px` }} className="whitespace-pre-wrap">
                {renderColorCodedText(debouncedOutputTokens)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">About LLM Tokens</h3>
        <p className="text-sm text-muted-foreground">
          Tokens are the basic units that LLMs process. In English, a token is approximately 4 characters or 0.75 words.
          Different models have different context window sizes (maximum tokens they can process):
        </p>
        <ul className="text-sm text-muted-foreground mt-2 list-disc pl-5 space-y-1">
          <li>GPT-3.5 Turbo: 4K or 16K tokens</li>
          <li>GPT-4: 8K or 32K tokens</li>
          <li>Claude 2: 100K tokens</li>
          <li>Claude Opus: 200K tokens</li>
          <li>Anthropic Claude 3 Sonnet: 200K tokens</li>
          <li>GPT-4o: 128K tokens</li>
          <li>Claude 3 Opus: 200K tokens</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Color Legend</h3>
        <ul className="text-sm grid grid-cols-2 gap-2">
          {TOKEN_MILESTONES.map((milestone, index) => (
            <li key={index} className="flex items-center">
              <span className={`w-4 h-4 inline-block mr-2 ${milestone.color}`}>■</span>
              {index === TOKEN_MILESTONES.length - 1 ? "1M+" : `Up to ${formatNumber(milestone.threshold)}`} tokens
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

