import { useAppContext } from "../context/AppContext";

export default function FileUpload() {
    const { setFileName, setPreviewRows } = useAppContext();

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;

        setFileName(f.name);

        const reader = new FileReader();
        reader.onload = (ev) => {
        const rows = String(ev.target?.result)
            .split("\n")
            .slice(0, 5)
            .map((r) => r.split(","));
        setPreviewRows(rows);
        };
        reader.readAsText(f);
    }

    return <input type="file" accept=".csv,.json" onChange={handleUpload} />;
}
