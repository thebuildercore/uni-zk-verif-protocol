import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { generateProof } from "./prover";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Generate proof endpoint
app.post("/prove", async (req: Request, res: Response) => {
  const { circuitPath, publicInputs } = req.body;

  if (!circuitPath || !publicInputs) {
    return res.status(400).json({ error: "Missing circuitPath or publicInputs" });
  }

  try {
    const proof = await generateProof(circuitPath, publicInputs);
    res.json({ proof });
  } catch (err: any) {
    console.error("Error generating proof:", err);
    res.status(500).json({ error: "Failed to generate proof" });
  }
});

app.listen(PORT, () => {
  console.log(`Prover service running on port ${PORT}`);
});
