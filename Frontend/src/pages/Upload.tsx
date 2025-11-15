import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Upload({ navigate }: { navigate: (page: string) => void }) {
    const { setFileName, setPreviewRows } = useAppContext();
    const [localFile, setLocalFile] = useState<File | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLocalFile(file);
        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = (event) => {
        try {
            const text = event.target?.result as string;

            // Handle JSON
            if (file.name.endsWith(".json")) {
            const json = JSON.parse(text);
            setPreviewRows(Array.isArray(json) ? json : [json]);
            }

            // Handle CSV
            else if (file.name.endsWith(".csv")) {
            const rows = text.split("\n").map((line) => line.split(","));
            setPreviewRows(rows);
            }
        } catch (err) {
            console.error("Error reading file:", err);
        }
        };

        reader.readAsText(file);
    };

    const handleNext = () => {
        if (!localFile) {
        alert("Please upload a file first.");
        return;
        }
        navigate("rule");
    };

    return (
        <div className="p-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Upload Company Data</h1>

        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Upload a CSV or JSON file containing your internal company data.
            This will be used to generate Zero-Knowledge proofs without exposing raw values.
        </p>

        {/* ---- Buttons Row ---- */}
        <div className="flex items-center justify-center gap-6 mt-6">

            {/* Choose File Button */}
            <label className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg cursor-pointer hover:bg-indigo-700 shadow-md transition">
            Choose File
            <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
            />
            </label>

            {/* Next Button */}
            <button
            onClick={handleNext}
            disabled={!localFile}
            className={`px-6 py-3 font-medium rounded-lg shadow-md transition ${
                localFile
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            >
            Next: Define Rule
            </button>

        </div>

        {/* Selected File Name */}
        {localFile && (
            <p className="mt-4 text-gray-800 font-medium">
            Selected File: {localFile.name}
            </p>
        )}
        </div>
    );
}
