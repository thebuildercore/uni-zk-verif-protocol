import { useAppContext } from "../context/AppContext";
import FileUpload from "../components/FileUpload";

export default function Upload({
    navigate,
    }: {
    navigate: (route: string) => void;
    }) {
    const { fileName, previewRows } = useAppContext();

    return (
        <div className="p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Upload Company Data</h2>

        <p className="text-gray-700 mb-4">
            Upload a CSV or JSON file containing your internal company data.  
            This data will be used to generate Zero-Knowledge proofs without exposing raw values.
        </p>

        {/* File Upload Component */}
        <FileUpload />

        {fileName && (
            <div className="mt-4 text-gray-800 text-sm">
            <strong>Uploaded File:</strong> {fileName}
            </div>
        )}

        {/* Preview Table */}
        {previewRows.length > 0 && (
            <div className="mt-6 bg-white border rounded shadow p-4 overflow-auto max-h-64">
            <h3 className="font-semibold mb-2">Preview (first 5 rows)</h3>

            <table className="w-full text-sm">
                <tbody>
                {previewRows.map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                    {row.map((cell: any, j: number) => (
                        <td key={j} className="px-2 py-1 border border-gray-200">
                        {String(cell).slice(0, 40)}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        {/* Next Button */}
        <div className="mt-8">
            <button
            onClick={() => navigate("rule")}
            disabled={!fileName}
            className={`px-6 py-3 rounded-lg text-white transition
                ${fileName ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
            Next: Define Rule
            </button>
        </div>
        </div>
    );
}
