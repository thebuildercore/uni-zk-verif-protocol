import express, { Request, Response } from "express";
import { execFile } from "child_process";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());

/* ---------------------------------------------
   Utility: Run prover CLI
------------------------------------------------ */
function runProver(args: string[]): Promise<string> {
  const proverPath = path.join(__dirname, "..", "..", "prover", "target", "release", "prover");

  return new Promise((resolve, reject) => {
    execFile(proverPath, args, { maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(stdout.trim());
    });
  });
}

/* ---------------------------------------------
   1. Generate Keys (PK + VK)
------------------------------------------------ */
app.post("/keygen", async (req: Request, res: Response) => {
  try {
    const circuitName = req.body.circuit || "document";
    const outputDir = path.join(__dirname, "..", "artifacts");

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const pkPath = path.join(outputDir, `${circuitName}.pk`);
    const vkPath = path.join(outputDir, `${circuitName}.vk`);

    const output = await runProver([
      "keygen",
      "--circuit", circuitName,
      "--pk", pkPath,
      "--vk", vkPath
    ]);

    res.json({
      status: "success",
      message: "Key generation complete",
      pk: pkPath,
      vk: vkPath,
      logs: output
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/* ---------------------------------------------
   2. Generate Proof
------------------------------------------------ */
app.post("/prove", async (req: Request, res: Response) => {
  try {
    const { circuit, input } = req.body;

    if (!circuit) {
      return res.status(400).json({ error: "circuit is required" });
    }

    const artifactsDir = path.join(__dirname, "..", "artifacts");
    const pkPath = path.join(artifactsDir, `${circuit}.pk`);

    if (!fs.existsSync(pkPath)) {
      return res.status(400).json({ error: "Proving key not found. Run /keygen first." });
    }

    const proofPath = path.join(artifactsDir, `${circuit}.proof`);

    const output = await runProver([
      "prove",
      "--circuit", circuit,
      "--input", JSON.stringify(input),
      "--pk", pkPath,
      "--proof", proofPath
    ]);

    res.json({
      status: "success",
      message: "Proof generated",
      proof: proofPath,
      logs: output
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/* ---------------------------------------------
   3. Verify Proof
------------------------------------------------ */
app.post("/verify", async (req: Request, res: Response) => {
  try {
    const { circuit, input } = req.body;

    const artifactsDir = path.join(__dirname, "..", "artifacts");
    const vkPath = path.join(artifactsDir, `${circuit}.vk`);
    const proofPath = path.join(artifactsDir, `${circuit}.proof`);

    if (!fs.existsSync(vkPath)) {
      return res.status(400).json({ error: "Verifying key not found. Run /keygen first." });
    }

    if (!fs.existsSync(proofPath)) {
      return res.status(400).json({ error: "Proof not found. Generate proof via /prove first." });
    }

    const output = await runProver([
      "verify",
      "--circuit", circuit,
      "--input", JSON.stringify(input),
      "--vk", vkPath,
      "--proof", proofPath
    ]);

    res.json({
      status: "success",
      verified: output.includes("VERIFIED"),
      logs: output
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/* ---------------------------------------------
   Server start
------------------------------------------------ */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Offchain API running on port ${PORT}`);
});
