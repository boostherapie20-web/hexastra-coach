const replacements: Array<[RegExp, string]> = [
  [/\bcertain\b/gi, 'probable'],
  [/\bforcément\b/gi, 'souvent'],
  [/\btoujours\b/gi, 'souvent'],
  [/\bjamais\b/gi, 'rarement'],
]

export function applySentinel(text: string) {
  let output = text
  for (const [pattern, value] of replacements) {
    output = output.replace(pattern, value)
  }
  return output
}
