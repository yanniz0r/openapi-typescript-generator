import { describe, expect, it } from "vitest";
import { getTypeReferenceFromRef } from "../src/getTypeReferenceFromRef";

describe("getTypeReferenceFromRef", () => {

  it('returns the correct type reference', () => {
    const type = getTypeReferenceFromRef('#/components/schemas/Animals')
    expect(type).toMatchInlineSnapshot('"Components[\\"Schemas\\"][\\"Animals\\"]"')
  })

});