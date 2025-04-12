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

  // データの保存と読み込み
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

  // 並び替え（進捗順）
  filteredTasks.sort((a, b) => a.progress - b.progress);

  const isDueSoon = (due) => {
    const today = new Date();
    const deadline = new Date(due);
    const diff = (deadline - today) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  return (
    <div className={`bg-gradient-to-br ${themes[theme]} min-h-screen p-4 sm:p-6 space-y-6`}>
      {/* 省略：ボタン・入力エリアは変わらず */}

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

      {/* 省略：クライアント編集Dialog */}
    </div>
  );
}
