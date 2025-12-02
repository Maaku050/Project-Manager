export const truncate = (
  text: string,
  limit: number,
  type: 'words' | 'chars' = 'words'
): string => {
  if (!text) return ''

  if (type === 'chars') {
    return text.length <= limit ? text : text.slice(0, limit).trim() + '...'
  }

  // words
  const words = text.trim().split(/\s+/)
  return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...'
}
