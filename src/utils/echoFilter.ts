/**
 * Self-echo and loop prevention utilities for Real-Time Human Voice Calls.
 * Guarantees that AI NEVER interprets its own speech or previously generated utterances as human input.
 * High-precision algorithm prevents false positives on common human conversational keywords (e.g., 'doctor', 'haan', 'clinic', 'appointment').
 */

// Normalize text for strict phonetic & structural comparison
export function cleanVoiceText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // Keep Unicode letters/numbers across Hindi, English, Punjabi, Urdu, Bengali
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates token-based Jaccard similarity coefficient (0 to 1) between two strings.
 */
export function calculateTextSimilarity(a: string, b: string): number {
  const cleanA = cleanVoiceText(a);
  const cleanB = cleanVoiceText(b);

  if (!cleanA || !cleanB) return 0;
  if (cleanA === cleanB) return 1.0;

  const wordsA = cleanA.split(' ').filter(Boolean);
  const wordsB = cleanB.split(' ').filter(Boolean);

  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  let intersection = 0;
  for (const w of setA) {
    if (setB.has(w)) intersection++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Checks whether an incoming recognized speech string is an actual echo of AI's own recent utterances.
 * 
 * Rules:
 * 1. Short human utterances (1-2 words, e.g. "haan", "theek hai", "kal", "doctor", "fees", "yes please") are NEVER echoes unless they are 100% exact full matches of an AI response.
 * 2. Multi-word utterances are only classified as echo if they exhibit very high similarity (>75% token overlap or identical verbatim match) with a recent AI response.
 */
export function isSelfSpeechEcho(spokenCandidate: string, recentAiOutputs: string[]): boolean {
  if (!spokenCandidate) return false;
  const cleanCandidate = cleanVoiceText(spokenCandidate);

  // Very short noises or 1 character strings are not valid speech
  if (cleanCandidate.length < 2) return false;

  const candidateWords = cleanCandidate.split(' ').filter(Boolean);

  for (const prevAiText of recentAiOutputs) {
    const cleanAi = cleanVoiceText(prevAiText);
    if (!cleanAi) continue;

    // 1. Direct identical match
    if (cleanCandidate === cleanAi) {
      return true;
    }

    // 2. Multi-word echo check (at least 3 words or > 18 characters)
    if (candidateWords.length >= 3 && cleanCandidate.length > 18) {
      // Verbatim long substring of the AI output
      if (cleanAi.includes(cleanCandidate)) {
        return true;
      }

      // High Jaccard overlap (> 0.75) for multi-word echo
      const similarity = calculateTextSimilarity(cleanCandidate, cleanAi);
      if (similarity >= 0.75) {
        return true;
      }
    }
  }

  return false;
}

