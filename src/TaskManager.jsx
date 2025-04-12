// ✅ 修正版UI（ボタン視認性改善 + タスク進捗一覧に戻す）
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const themeColors = [
  "bg-red-100", "bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100"
];

export default function TaskManager() {
  const [clientList, setClientList] = useState([
    { name: "クライアントA", color: "bg-red-100" },
    { name: "クライアントB", color: "bg-green-100" }
  ]);
  const [newClient, setNewClient] = useState("");
  const [activeClient, setActiveClient] = useState("すべてのタスク");
  const [projects, setProjects] = useState({
    "クライアントA": [
      { title: "タスク1", done: true },
      { title: "タスク2", done: false },
      { title: "タスク3", done: false }
    ],
    "クライアントB": [
      { title: "タスク1", done: true }
    ]
  });

  const addClient = () => {
    if (!newClient.trim()) return;
    const exists = clientList.some(c => c.name === newClient.trim());
    if (exists) return;
    const color = themeColors[clientList.length % themeColors.length];
    setClientList([...clientList, { name: newClient.trim(), color }]);
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

  const visibleClients = activeClient === "すべてのタスク" ? clientList : clientList.filter(c => c.name === activeClient);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setActiveClient("すべてのタスク")} className={`text-xs px-3 py-1 rounded-full shadow ${activeClient === "すべてのタスク" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900 hover:bg-blue-100"}`}>すべてのタスク</Button>
        {clientList.map((c, i) => (
          <div key={c.name} className="flex items-center gap-1">
            <Button onClick={() => setActiveClient(c.name)} className={`text-xs px-3 py-1 rounded-full shadow ${activeClient === c.name ? "bg-blue-600 text-white" : `${c.color} text-gray-800 hover:bg-blue-100`}`}>{c.name}</Button>
            <Button size="sm" onClick={() => deleteClient(c.name)} className="text-xs text-red-500 hover:text-red-700">🗑</Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Input value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="クライアント名" className="rounded-lg border px-3 py-2 flex-1" />
        <Button onClick={addClient} className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-4 py-2">＋ 追加</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {visibleClients.map(c => (
          <Card key={c.name} className={`rounded-xl shadow p-4 ${c.color}`}>
            <CardContent className="space-y-3">
              <div className="font-bold text-lg text-gray-900">{c.name}</div>
              {(projects[c.name] || []).map((task, index) => (
                <div key={index} className="bg-white p-2 rounded border shadow-sm flex justify-between items-center">
                  <span className="text-gray-800">{task.title}</span>
                  <span className={`text-sm font-medium ${task.done ? "text-green-600" : "text-gray-500"}`}>{task.done ? "完了" : "未完了"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
