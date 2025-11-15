import { useAppContext } from "../context/AppContext";
import RuleConditionRow from "../components/RuleConditionRow";
import { type RuleCondition } from "../types/rules";

export default function RuleBuilder({
    navigate,
    }: {
    navigate: (route: string) => void;
    }) {
    const { ruleType, setRuleType, conditions, setConditions } = useAppContext();

    // Add new condition row
    function addCondition() {
        const newCondition: RuleCondition = {
        id: Math.random().toString(36).slice(2, 9),
        field: "",
        operator: ">",
        value: "",
        };
        setConditions([...conditions, newCondition]);
    }

    // Update a condition by id
    function updateCondition(id: string, patch: Partial<RuleCondition>) {
        const updated = conditions.map((c) =>
        c.id === id ? { ...c, ...patch } : c
        );
        setConditions(updated);
    }

    // Remove a condition by id
    function removeCondition(id: string) {
        const updated = conditions.filter((c) => c.id !== id);
        setConditions(updated);
    }

    return (
        <div className="p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Define Rule</h2>

        {/* Rule Type Dropdown */}
        <div className="mb-6">
            <label className="block font-medium mb-2">Select Rule Template</label>
            <select
            value={ruleType}
            onChange={(e) => setRuleType(e.target.value)}
            className="border p-2 rounded w-full"
            >
            <option>Vendor Verification</option>
            <option>HR Eligibility</option>
            <option>ESG Compliance</option>
            <option>Financial Audit</option>
            </select>
        </div>

        {/* Condition List */}
        <h3 className="text-xl font-semibold mb-3">Rule Conditions</h3>

        <div className="space-y-4 bg-white p-4 border rounded shadow">
            {conditions.map((condition) => (
            <RuleConditionRow
                key={condition.id}
                condition={condition}
                update={(patch) => updateCondition(condition.id, patch)}
                remove={() => removeCondition(condition.id)}
            />
            ))}

            {/* Add condition */}
            <button
            onClick={addCondition}
            className="px-4 py-2 w-full border rounded hover:bg-gray-100 transition"
            >
            + Add Condition
            </button>
        </div>

        {/* Next button */}
        <div className="mt-8">
            <button
            onClick={() => navigate("generate")}
            disabled={conditions.length === 0}
            className={`px-6 py-3 rounded-lg text-white transition
                ${
                conditions.length > 0
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
            Next: Generate Proof
            </button>
        </div>
        </div>
    );
}
