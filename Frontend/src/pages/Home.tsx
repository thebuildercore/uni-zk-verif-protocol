import React from "react";

export default function Home({
    navigate,
    }: {
    navigate: (route: string) => void;
    }) {
    return (
        <div className="bg-white p-10 rounded-xl shadow">
        <h1 className="text-4xl font-extrabold mb-4">ZK Verification Dashboard</h1>
        <p className="text-gray-600 mb-6">
            Upload your company data, define rules, generate Zero-Knowledge proofs, and verify them on the Midnight blockchain.
        </p>
        <div className="flex gap-4">
            <button
                onClick={() => navigate("generate")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                Start New Proof Verification
                </button>


            <button
                onClick={() => navigate("history")}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
                >
                View Proof History
            </button>

        </div>

        <div className="mt-10 p-6 bg-white border rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Quick Start</h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Upload CSV/JSON company data</li>
            <li>Select rule type (HR / Vendor / ESG / Finance)</li>
            <li>Customize rule conditions</li>
            <li>Generate Zero-Knowledge Proof</li>
            <li>Submit to smart contract for verification</li>
            </ul>
        </div>
        </div>
    );
}
