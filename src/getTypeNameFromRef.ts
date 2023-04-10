export function getTypeNameFromRef(ref: string): string {
  return ref.split('/').pop()!;
}