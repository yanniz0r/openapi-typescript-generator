import { uppercaseFirstCharacter } from "./helpers/uppercaseFirstCharacter";

export function getTypeReferenceFromRef(ref: string): string {
  let referenceString = ''
  const segments = ref.split('/')
  // Remove first element because it will be a '#'
  segments.shift()

  segments.forEach((segment, index) => {
    const segmentIsFirst = index === 0
    if (segmentIsFirst) {
      referenceString += uppercaseFirstCharacter(segment)
    } else {
      referenceString += `["${uppercaseFirstCharacter(segment)}"]`
    }
  })

  return referenceString
}