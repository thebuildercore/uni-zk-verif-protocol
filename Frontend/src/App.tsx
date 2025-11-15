import React, { useState } from "react";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import RuleBuilder from "./pages/RuleBuilder";
import GenerateProof from "./pages/GenerateProof";
import SubmitProof from "./pages/SubmitProof";
import History from "./pages/History";
import "./index.css";

export default function App() {
  const [route, setRoute] = useState("home");

  const navigate = (page: string) => setRoute(page);

return (
  <div className="min-h-screen bg-gray-100 text-gray-900">
    <TopNav navigate={navigate} />

    <main className="max-w-6xl mx-auto p-8">
      {route === "home" && <Home navigate={navigate} />}
      {route === "upload" && <Upload navigate={navigate} />}
      {route === "rule" && <RuleBuilder navigate={navigate} />}
      {route === "generate" && <GenerateProof navigate={navigate} />}
      {route === "submit" && <SubmitProof navigate={navigate} />}
      {route === "history" && <History navigate={navigate} />}
    </main>
  </div>
);
}
