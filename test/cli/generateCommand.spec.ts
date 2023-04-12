import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { GenerateCommand } from "../../src/cli/GenerateCommand";
import petstoreSchema from "../__fixtures__/petstore.json";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { writeFileSync } from "node:fs";

vi.mock("node:fs", async () => {
  return {
    ...(await vi.importActual<typeof import("node:fs")>("node:fs")),
    writeFileSync: vi.fn(),
  };
});

const PETSTORE_API_URL = "http://petstore.com/api.json"

describe("GenerateCommand", () => {
  let mockServer: ReturnType<typeof setupServer>

  beforeAll(() => {
    mockServer = setupServer(
      rest.get(PETSTORE_API_URL, (req, res, ctx) => {
        return res(ctx.json(petstoreSchema))
      })
    )
    mockServer.listen()
  })

  afterAll(() => {
    mockServer.close()
  })

  it("tries to load a local file", async () => {
    const generateCommand = new GenerateCommand(__dirname);
    await generateCommand.parseAsync(["node", "test", "--input", "../__fixtures__/petstore.json", "--output", "test/fixtures/petstore.ts"]);
    expect(writeFileSync).toHaveBeenCalled()
  });

  it("tries to load a remote file", async () => {
    const generateCommand = new GenerateCommand(__dirname);
    await generateCommand.parseAsync(["node", "test", "--input", PETSTORE_API_URL, "--output", "test/fixtures/petstore.ts"]);
    expect(writeFileSync).toHaveBeenCalled()
  })
});
