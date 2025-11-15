export default function TopNav({ navigate }: { navigate: (r: string) => void }) {
    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
            <h1 className="text-lg font-bold text-indigo-700">ZK Verification</h1>

            <div className="flex gap-4">
            <button onClick={() => navigate("home")} className="hover:text-indigo-600">
                Home
            </button>

            <button onClick={() => navigate("upload")} className="hover:text-indigo-600">
                Upload
            </button>

            <button onClick={() => navigate("history")} className="hover:text-indigo-600">
                History
            </button>
            </div>
        </div>
        </nav>
    );
}
