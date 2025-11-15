export function useMockBackend() {
    async function generateProof(data: any, rule: any) {
        await new Promise((r) => setTimeout(r, 1200));
        return { proofHash: "proof_" + Math.random().toString(36).slice(2, 9) };
    }

    async function submitProof(proofHash: string) {
        await new Promise((r) => setTimeout(r, 1200));
        const ok = Math.random() > 0.2; 
        return { txHash: "tx_" + Math.random().toString(36).slice(2, 9), verified: ok };
    }

    return { generateProof, submitProof };
}
