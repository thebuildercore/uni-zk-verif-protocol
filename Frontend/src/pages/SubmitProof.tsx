import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useMockBackend } from "../hooks/mockBackend";

export default function SubmitProof({
    navigate,
    }: {
    navigate: (route: string) => void;
    }) {
    const { currentProofHash, setHistory, history } = useAppContext();
    const backend = useMockBackend();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<null | "verified" | "rejected">(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    async function handleSubmit() {
        if (!currentProofHash) return;

        setIsSubmitting(true);
        try {
        const resp = await backend.submitProof(currentProofHash);

        setTxHash(resp.txHash);
        setResult(resp.verified ? "verified" : "rejected");

        // Update history
        const updated = [...history];
        const index = updated.findIndex((h) => h.proofHash === currentProofHash);

        if (index >= 0) {
            updated[index] = {
            ...updated[index],
            status: resp.verified ? "verified" : "rejected",
            txHash: resp.txHash,
            };
        }

        setHistory(updated);
        } finally {
        setIsSubmitting(false);
        }
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
            Submit Proof to Midnight Smart Contract
        </h2>

        <div className="p-4 bg-white shadow rounded border mb-6">
            <div className="text-gray-700">
            <strong>Proof Hash:</strong>
            </div>
            <div className="mt-1 break-all font-mono text-sm text-gray-900">
            {currentProofHash || "No proof generated"}
            </div>
        </div>

        {!result && (
            <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
            {isSubmitting ? "Submitting..." : "Submit Proof"}
            </button>
        )}

        {result && (
            <div className="mt-6 p-4 rounded border shadow bg-white">
            <h3 className="text-xl font-medium mb-2">Result:</h3>

            <div
                className={
                "text-lg font-bold " +
                (result === "verified" ? "text-green-600" : "text-red-600")
                }
            >
                {result === "verified" ? "✓ Verified" : "✗ Rejected"}
            </div>

            <div className="mt-4 text-gray-700">
                <strong>Transaction Hash:</strong>
            </div>
            <div className="break-all font-mono text-sm">{txHash}</div>

            <button
                onClick={() => navigate("history")}
                className="mt-6 px-4 py-2 border rounded hover:bg-gray-100"
            >
                View History
            </button>
            </div>
        )}
        </div>
    );
}
