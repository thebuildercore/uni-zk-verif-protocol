import { createContext, useContext, useState } from "react";
import type { RuleCondition } from "../types/rules";
import type { ProofHistoryItem } from "../types/history";

type AppState = {
    fileName: string | null;
    previewRows: any[];
    ruleType: string;
    conditions: RuleCondition[];
    currentProofHash: string | null;
    history: ProofHistoryItem[];

    setFileName: (v: string | null) => void;
    setPreviewRows: (v: any[]) => void;
    setRuleType: (v: string) => void;
    setConditions: (v: RuleCondition[]) => void;
    setCurrentProofHash: (v: string | null) => void;
    setHistory: (v: ProofHistoryItem[]) => void;
    };

    const Ctx = createContext<AppState | null>(null);

    export function useAppContext() {
    return useContext(Ctx)!;
    }

    export function AppProvider({ children }: { children: React.ReactNode }) {
    const [fileName, setFileName] = useState<string | null>(null);
    const [previewRows, setPreviewRows] = useState<any[]>([]);
    const [ruleType, setRuleType] = useState<string>("Vendor Verification");
    const [conditions, setConditions] = useState<RuleCondition[]>([]);
    const [currentProofHash, setCurrentProofHash] = useState<string | null>(null);
    const [history, setHistory] = useState<ProofHistoryItem[]>([]);

    return (
        <Ctx.Provider
        value={{
            fileName,
            previewRows,
            ruleType,
            conditions,
            currentProofHash,
            history,

            setFileName,
            setPreviewRows,
            setRuleType,
            setConditions,
            setCurrentProofHash,
            setHistory,
        }}
        >
        {children}
        </Ctx.Provider>
    );
}
