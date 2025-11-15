import type { RuleCondition } from "../types/rules";

export default function RuleConditionRow({
    condition,
    update,
    remove,
    }: {
    condition: RuleCondition;
    update: (patch: Partial<RuleCondition>) => void;
    remove: () => void;
    }) {
    return (
        <div className="flex items-center gap-2">
        <input
            value={condition.field}
            placeholder="field"
            className="border p-1 rounded"
            onChange={(e) => update({ field: e.target.value })}
        />
        <select
            value={condition.operator}
            className="border p-1 rounded"
            onChange={(e) => update({ operator: e.target.value as any })}
        >
            <option>{">"}</option>
            <option>{"<"}</option>
            <option>{">="}</option>
            <option>{"<="}</option>
            <option>{"=="}</option>
            <option>{"!="}</option>
        </select>
        <input
            value={condition.value}
            placeholder="value"
            className="border p-1 rounded"
            onChange={(e) => update({ value: e.target.value })}
        />
        <button className="border px-2 py-1" onClick={remove}>
            Remove
        </button>
        </div>
    );
}
