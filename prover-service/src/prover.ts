import { execFile } from "child_process";
import path from "path";

const proverCli = process.env.PROVER_CLI_PATH || path.join(__dirname, "../../prover/target/release/prover");

/**
 * Generate a proof using your Rust ZK prover CLI.
 * @param circuitPath Path to circuit config / witness
 * @param publicInputs Array of public inputs
 */
export function generateProof(circuitPath: string, publicInputs: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = ["prove", "--circuit", circuitPath, "--inputs", JSON.stringify(publicInputs)];

    execFile(proverCli, args, (error, stdout, stderr) => {
      if (error) {
        console.error("Prover error:", stderr);
        return reject(error);
      }

      resolve(stdout.trim());
    });
  });
}
