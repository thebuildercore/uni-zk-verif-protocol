import { useAppContext } from "../context/AppContext";

export default function HistoryTable() {
    const { history } = useAppContext();

    return (
        <table className="w-full text-sm">
        <thead className="bg-gray-100">
            <tr>
            <th className="p-2 text-left">Rule Type</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Proof Hash</th>
            <th className="p-2 text-left">Tx Hash</th>
            <th className="p-2 text-left">Date</th>
            </tr>
        </thead>
        <tbody>
            {history.map((h) => (
            <tr key={h.id} className="even:bg-gray-50">
                <td className="p-2">{h.ruleType}</td>
                <td className="p-2">{h.status}</td>
                <td className="p-2">{h.proofHash}</td>
                <td className="p-2">{h.txHash || "-"}</td>
                <td className="p-2">
                {new Date(h.createdAt).toLocaleString()}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}
