export type ProofHistoryItem = {
    id: string;
    ruleType: string;
    status: "pending" | "verified" | "rejected";
    createdAt: string;
    proofHash?: string;
    txHash?: string;
};
