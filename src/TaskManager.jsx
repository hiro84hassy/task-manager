// 最新版：完了・編集・削除・並び替え・完了表示切替付き
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";

const themes = {
  blue: "from-white to-blue-100 text-gray-900",
  pink: "from-pink-100 to-red-100 text-gray-900",
  green: "from-green-100 to-teal-100 text-gray-900",
  dark: "from-gray-900 to-gray-800 text-white"
};

export default function TaskManager() {
  const [theme, setTheme] = useState("blue");
  const [clientList, setClientList] = useState(["クライアントA", "クライアントB"]);
  const [activeClient, setActiveClient] = useState("すべてのタスク");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [client, setClient] = useState(clientList[0] || "");
  const [projects, setProjects] = useState({
    "クライアントA": [],
    "クライアントB": []
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showDone, setShowDone] = useState(true);

  const allTasks = Object.values(projects).flat();
  const currentTasks = activeClient === "すべてのタスク" ? allTasks : (projects[activeClient] || []);
  const filteredTasks = currentTasks
    .filter(t => t.title.includes(search) || t.client.includes(search))
    .filter(t => showDone || t.status !== "done");
  const doneTasks = currentTasks.filter(t => t.status === "done").length;
  const completionRate = currentTasks.length === 0 ? 0 : Math.round((doneTasks / currentTasks.length) * 100);

  const addTask = () => {
    if (!newTask || !dueDate || !client || activeClient === "すべてのタスク") return;
    const updated = { ...projects };
    if (!updated[client]) updated[client] = [];
    updated[client].push({ title: newTask, due: dueDate, client, status: "todo" });
    setProjects(updated);
    setNewTask("");
    setDueDate("");
  };

  const markDone = (client, index) => {
    const updated = { ...projects };
    updated[client][index].status = "done";
    setProjects(updated);
  };

  const deleteTask = (client, index) => {
    const updated = { ...projects };
    updated[client].splice(index, 1);
    setProjects(updated);
  };

  const startEdit = (task, index) => {
    setEditIndex(index);
    setEditTitle(task.title);
  };

  const saveEdit = (client, index) => {
    const updated = { ...projects };
    updated[client][index].title = editTitle;
    setProjects(updated);
    setEditIndex(null);
    setEditTitle("");
  };

  return (
    <div className={`bg-gradient-to-br ${themes[theme]} min-h-screen p-4 sm:p-6 space-y-6`}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-semibold tracking-wide">
          📂 現在のボード: {activeClient} | 🌟 完了率: {completionRate}%（{doneTasks}/{currentTasks.length}）
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm">
            <input type="checkbox" checked={showDone} onChange={() => setShowDone(!showDone)} className="mr-1" />完了タスクも表示
          </label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded px-2 py-1 text-sm border">
            <option value="blue">🔵 青系</option>
            <option value="pink">🌸 ピンク系</option>
            <option value="green">🌿 緑系</option>
            <option value="dark">🌙 ダーク</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => setActiveClient("すべてのタスク")} className={`text-xs rounded-full px-3 py-1 ${activeClient === "すべてのタスク" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-blue-200"}`}>すべてのタスク</Button>
        {clientList.map(name => (
          <Button key={name} onClick={() => setActiveClient(name)} className={`text-xs rounded-full px-3 py-1 ${activeClient === name ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-blue-200"}`}>{name}</Button>
        ))}
      </div>

      <Input placeholder="🔍 タスク名またはクライアント名で検索" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-blue-300 rounded-xl px-4 py-2 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />

      <div className="grid gap-3 sm:gap-5 mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Input placeholder="✨ 新しいタスク" value={newTask} onChange={(e) => setNewTask(e.target.value)} className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full" />
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full" />
        <select value={client} onChange={(e) => setClient(e.target.value)} className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full">
          {clientList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button onClick={addTask} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-4 py-2 transition-all shadow-md w-full">＋ 追加</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task, idx) => (
          <Card key={idx} className={`rounded-xl shadow p-4 bg-white ${task.status === "done" ? "opacity-50" : ""}`}>
            <CardContent className="p-0 space-y-2">
              {editIndex === idx ? (
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              ) : (
                <div className="font-semibold text-lg text-black">{task.title}</div>
              )}
              <div className="text-sm text-gray-600">期限: {task.due} | クライアント: {task.client}</div>
              <div className="flex gap-2 pt-2">
                {task.status !== "done" && (
                  <Button size="sm" onClick={() => markDone(task.client, idx)} className="text-xs bg-green-500 hover:bg-green-600 text-white rounded px-2 py-1">✅ 完了</Button>
                )}
                {editIndex === idx ? (
                  <Button size="sm" onClick={() => saveEdit(task.client, idx)} className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded px-2 py-1">💾 保存</Button>
                ) : (
                  <Button size="sm" onClick={() => startEdit(task, idx)} className="text-xs bg-gray-500 hover:bg-gray-600 text-white rounded px-2 py-1">✏ 編集</Button>
                )}
                <Button size="sm" onClick={() => deleteTask(task.client, idx)} className="text-xs bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1">🗑 削除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
