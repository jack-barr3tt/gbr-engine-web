export function titleCase(input: string): string {
  if (!input) return input
  return input
    .split(" ")
    .map((word) => (word.length === 0 ? "" : word[0].toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ")
}
