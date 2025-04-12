// ✅ 最新版コード：クライアント削除、色分け、進捗率編集機能を含む
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const themeColors = [
  "bg-red-100", "bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100"
];

export default function TaskManager() {
  const [clientList, setClientList] = useState([
    { name: "クライアントA", color: "bg-red-100", progress: 30 },
    { name: "クライアントB", color: "bg-green-100", progress: 50 }
  ]);
  const [newClient, setNewClient] = useState("");
  const [activeClient, setActiveClient] = useState("すべてのタスク");
  const [projects, setProjects] = useState({});

  const addClient = () => {
    if (!newClient.trim()) return;
    const exists = clientList.some(c => c.name === newClient.trim());
    if (exists) return;
    const color = themeColors[clientList.length % themeColors.length];
    setClientList([...clientList, { name: newClient.trim(), color, progress: 0 }]);
    setProjects({ ...projects, [newClient.trim()]: [] });
    setNewClient("");
  };

  const deleteClient = (name) => {
    if (activeClient === name) return alert("表示中のクライアントは削除できません");
    setClientList(clientList.filter(c => c.name !== name));
    const updated = { ...projects };
    delete updated[name];
    setProjects(updated);
  };

  const updateProgress = (name, newProgress) => {
    setClientList(clientList.map(c =>
      c.name === name ? { ...c, progress: parseInt(newProgress) } : c
    ));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setActiveClient("すべてのタスク")} className={`text-xs px-3 py-1 ${activeClient === "すべてのタスク" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>すべてのタスク</Button>
        {clientList.map((c, i) => (
          <div key={c.name} className="flex items-center gap-1">
            <Button onClick={() => setActiveClient(c.name)} className={`text-xs px-3 py-1 ${activeClient === c.name ? "bg-blue-600 text-white" : `${c.color} text-black`}`}>{c.name}</Button>
            <Button size="sm" onClick={() => deleteClient(c.name)} className="text-xs">🗑</Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="クライアント名" />
        <Button onClick={addClient} className="bg-green-500 text-white">＋ 追加</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clientList.map(c => (
          <div key={c.name} className={`p-4 rounded shadow ${c.color}`}>
            <div className="font-semibold">{c.name}</div>
            <div className="mt-1 text-sm">進捗率: {c.progress}%</div>
            <select value={c.progress} onChange={e => updateProgress(c.name, e.target.value)} className="mt-2 w-full">
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i * 10}>{i * 10}%</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
