import { describe, expect, it, vi } from "vitest";
import { GenerateCommand } from "../../src/cli/generateCommand";
import { writeFileSync } from "node:fs";

vi.mock("node:fs", async () => {
  return {
    ...(await vi.importActual<typeof import("node:fs")>("node:fs")),
    writeFileSync: vi.fn(),
  };
});

describe("GenerateCommand", () => {
  it("tries to load a local file", () => {
    const generateCommand = new GenerateCommand(__dirname);
    generateCommand.parse(["node", "test", "--input", "../__fixtures__/petstore.json", "--output", "test/fixtures/petstore.ts"]);
    expect(writeFileSync).toHaveBeenCalled()
  });
});
