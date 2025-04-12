// ✅ 各クライアントに属するタスクの一覧とそれぞれの進捗表示
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const themeColors = [
  "bg-red-200", "bg-green-200", "bg-blue-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200"
];

export default function TaskManager() {
  const [clientList, setClientList] = useState([
    { name: "クライアントA", color: "bg-red-200" },
    { name: "クライアントB", color: "bg-green-200" }
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setActiveClient("すべてのタスク")} className={`text-xs px-3 py-1 rounded-full shadow ${activeClient === "すべてのタスク" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}>すべてのタスク</Button>
        {clientList.map((c, i) => (
          <div key={c.name} className="flex items-center gap-1">
            <Button onClick={() => setActiveClient(c.name)} className={`text-xs px-3 py-1 rounded-full shadow ${activeClient === c.name ? "bg-blue-600 text-white" : `${c.color} text-black`}`}>{c.name}</Button>
            <Button size="sm" onClick={() => deleteClient(c.name)} className="text-xs text-red-500 hover:text-red-700">🗑</Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Input value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="クライアント名" className="rounded-lg border px-3 py-2 flex-1" />
        <Button onClick={addClient} className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-4 py-2">＋ 追加</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {clientList.map(c => (
          <Card key={c.name} className={`rounded-xl shadow p-4 ${c.color}`}>
            <CardContent className="space-y-3">
              <div className="font-bold text-lg">{c.name}</div>
              {(projects[c.name] || []).map((task, index) => (
                <div key={index} className="bg-white p-2 rounded border shadow-sm flex justify-between items-center">
                  <span>{task.title}</span>
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
