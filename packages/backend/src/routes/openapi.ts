import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { minifyContractRouter } from "@orpc/contract";
import { app } from ".";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const minifiedRouter = minifyContractRouter(app);

const outputPath = path.join(__dirname, "../../dist/contract.json");

fs.writeFileSync(outputPath, JSON.stringify(minifiedRouter));
