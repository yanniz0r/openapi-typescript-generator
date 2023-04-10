import { uppercaseFirstCharacter } from "./helpers/uppercaseFirstCharacter";

export function getTypeNameFromRef(ref: string): string {
  const segments = ref.split('/')
  const type = segments.pop()!;
  const namespace = segments.pop()!;
  return `${uppercaseFirstCharacter(namespace)}["${type}"]`;
}