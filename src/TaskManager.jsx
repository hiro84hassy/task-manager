// ✅ クライアントごとに表示切り替え可能に（プロジェクトではなくクライアントベース）＋ 完了タスクの非表示切替＆並び替え追加＋期限が近いタスクは濃く表示＋ローカルストレージ保存
import { useEffect, useState } from "react";
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
  const [activeClient, setActiveClient] = useState("すべてのタスク");
  const [theme, setTheme] = useState("blue");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [client, setClient] = useState("");
  const [clientList, setClientList] = useState(["クライアントA", "クライアントB"]);
  const [tasks, setTasks] = useState([]);

  const [showClientDialog, setShowClientDialog] = useState(false);
  const [editClients, setEditClients] = useState(clientList.join(", "));
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("myTasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask || !dueDate || !client) return;
    const newEntry = { title: newTask, due: dueDate, client, progress: 0 };
    setTasks([...tasks, newEntry]);
    setNewTask("");
    setDueDate("");
    setClient("");
  };

  const updateTask = (idx, field, value) => {
    const updated = [...tasks];
    updated[idx][field] = value;
    setTasks(updated);
  };

  const deleteTask = (idx) => {
    const updated = [...tasks];
    updated.splice(idx, 1);
    setTasks(updated);
  };

  const handleClientSelect = (value) => {
    if (value === "__add__") {
      setEditClients(clientList.join(", "));
      setShowClientDialog(true);
    } else {
      setClient(value);
    }
  };

  const saveClientList = () => {
    const cleaned = editClients.split(",").map(c => c.trim()).filter(Boolean);
    setClientList(cleaned);
    setShowClientDialog(false);
  };

  let filteredTasks = tasks.filter(t => {
    const matchesClient = activeClient === "すべてのタスク" || t.client === activeClient;
    const matchesSearch = t.title.includes(search) || t.client.includes(search);
    return matchesClient && matchesSearch;
  });

  if (!showCompleted) {
    filteredTasks = filteredTasks.filter(t => t.progress < 100);
  }

  const doneTasks = filteredTasks.filter(t => t.progress === 100).length;
  const completionRate = filteredTasks.length === 0 ? 0 : Math.round((doneTasks / filteredTasks.length) * 100);

  filteredTasks.sort((a, b) => a.progress - b.progress);

  const isDueSoon = (due) => {
    const today = new Date();
    const deadline = new Date(due);
    const diff = (deadline - today) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  return (
    <div className={`bg-gradient-to-br ${themes[theme]} min-h-screen p-4 sm:p-6 space-y-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm font-semibold tracking-wide">
          📂 現在のボード: {activeClient} | 🌟 完了率: {completionRate}%（{doneTasks}/{filteredTasks.length}）
        </div>
        <div className="flex items-center gap-2">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded px-2 py-1 text-sm border"
          >
            <option value="blue">🔵 青系</option>
            <option value="pink">🌸 ピンク系</option>
            <option value="green">🌿 緑系</option>
            <option value="dark">🌙 ダーク</option>
          </select>
          <Button variant="outline" onClick={() => setShowClientDialog(true)}>🖋 クライアント管理</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => setActiveClient("すべてのタスク")}
          className={`text-xs rounded-full px-3 py-1 ${activeClient === "すべてのタスク" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-blue-200"}`}
        >すべてのタスク</Button>
        {clientList.map(name => (
          <Button
            key={name}
            onClick={() => setActiveClient(name)}
            className={`text-xs rounded-full px-3 py-1 ${activeClient === name ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-blue-200"}`}
          >{name}</Button>
        ))}
      </div>

      <Input
        placeholder="🔍 タスク名またはクライアント名で検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-blue-300 rounded-xl px-4 py-2 bg-white text-black shadow-sm"
      />

      <div className="grid gap-3 sm:gap-5 mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Input
          placeholder="✨ 新しいタスク"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full"
        />
        <select
          value={client || ""}
          onChange={(e) => handleClientSelect(e.target.value)}
          className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full"
        >
          <option value="">🎨 クライアントを選択</option>
          {clientList.map(c => <option key={c} value={c}>{c}</option>)}
          <option value="__add__">＋ クライアントを追加</option>
        </select>
        <Button onClick={addTask} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-4 py-2 w-full">＋ 追加</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task, idx) => {
          const highlight = isDueSoon(task.due) ? "bg-red-100" : "bg-white";
          return (
            <Card key={idx} className={`${highlight} rounded-xl shadow p-4`}>
              <CardContent className="p-0 space-y-2">
                <div className="text-black font-semibold text-lg cursor-pointer hover:underline" onClick={() => setEditingTaskIndex(editingTaskIndex === idx ? null : idx)}>{task.title}</div>
                <div className="text-sm text-gray-600">期限: {task.due}｜クライアント: {task.client}</div>
                <div className="text-sm text-gray-800 font-medium">進捗率: {task.progress || 0}%</div>
                {editingTaskIndex === idx && (
                  <>
                    <Input value={task.title} onChange={(e) => updateTask(idx, "title", e.target.value)} className="text-black font-semibold text-lg w-full" />
                    <div className="flex items-center gap-2">
                      <label className="text-sm">進捗編集:</label>
                      <select value={task.progress || 0} onChange={(e) => updateTask(idx, "progress", Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
                        {[...Array(11)].map((_, i) => (<option key={i} value={i * 10}>{i * 10}%</option>))}
                      </select>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteTask(idx)}>削除</Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>クライアント名を編集</DialogTitle>
            <Input value={editClients} onChange={(e) => setEditClients(e.target.value)} placeholder="例: A, B, C" />
            <Button onClick={saveClientList} className="mt-2">保存</Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
