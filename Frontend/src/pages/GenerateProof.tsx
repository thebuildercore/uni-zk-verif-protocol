import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useMockBackend } from "../hooks/mockBackend";

export default function GenerateProof({
    navigate,
    }: {
    navigate: (route: string) => void;
    }) {
    const {
        fileName,
        previewRows,
        ruleType,
        conditions,
        setCurrentProofHash,
        history,
        setHistory,
    } = useAppContext();

    const backend = useMockBackend();
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleGenerateProof() {
        setIsGenerating(true);

        try {
        const rulePayload = { ruleType, conditions };
        const dataPayload = { fileName, previewRows };

        const resp = await backend.generateProof(dataPayload, rulePayload);

        // Save proof hash globally
        setCurrentProofHash(resp.proofHash);

        // Add to history as pending
        const newItem = {
            id: Math.random().toString(36).slice(2, 9),
            ruleType,
            status: "pending" as const,
            createdAt: new Date().toISOString(),
            proofHash: resp.proofHash,
        };

        setHistory([newItem, ...history]);

        navigate("submit");
        } finally {
        setIsGenerating(false);
        }
    }

    return (
        <div className="p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Generate Zero-Knowledge Proof</h2>

        {/* Summary card */}
        <div className="bg-white border rounded shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Rule Summary</h3>

            <div className="mb-4">
            <strong>Rule Type:</strong>{" "}
            <span className="text-indigo-700">{ruleType}</span>
            </div>

            <div>
            <strong>Conditions:</strong>
            <ul className="list-disc ml-6 text-gray-700 mt-2">
                {conditions.map((c) => (
                <li key={c.id} className="text-sm">
                    {c.field} {c.operator} {c.value}
                </li>
                ))}
            </ul>
            </div>
        </div>

        {/* Generate Button */}
        <button
            onClick={handleGenerateProof}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg text-white transition
            ${
                isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
        >
            {isGenerating ? "Generating Proof..." : "Generate Proof"}
        </button>
        </div>
    );
}
