const STOP_WORDS = new Set(['the','a','an','is','are','of','and','or','to','in','on','for','with','my','your','our','me'])

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\u0900-\u097F\u0980-\u09FF\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

export function scoreTextAgainstPatterns(userText, patterns) {
  const userTokens = tokenize(userText).filter((t) => !STOP_WORDS.has(t))
  const userSet = new Set(userTokens)

  let best = 0
  for (const pattern of patterns) {
    const patternTokens = tokenize(pattern).filter((t) => !STOP_WORDS.has(t))
    let overlap = 0
    for (const tok of patternTokens) {
      if (userSet.has(tok)) overlap += 1
    }
    const denom = Math.max(patternTokens.length, 1)
    const score = overlap / denom
    if (score > best) best = score
  }
  return best
}

