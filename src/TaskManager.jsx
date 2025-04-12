import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";

const projectNames = ["すべてのタスク", "プロジェクトA", "プロジェクトB"];

export default function TaskManager() {
  const [activeProject, setActiveProject] = useState("すべてのタスク");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [client, setClient] = useState("");
  const [projects, setProjects] = useState({
    "プロジェクトA": [],
    "プロジェクトB": []
  });

  const allTasks = Object.values(projects).flat();
  const currentTasks = activeProject === "すべてのタスク" ? allTasks : projects[activeProject];
  const doneTasks = currentTasks.filter(t => t.status === "done").length;
  const completionRate = currentTasks.length === 0 ? 0 : Math.round((doneTasks / currentTasks.length) * 100);

  const addTask = () => {
    if (!newTask || !dueDate || !client || activeProject === "すべてのタスク") return;
    const updated = { ...projects };
    updated[activeProject].push({ title: newTask, due: dueDate, client, status: "todo" });
    setProjects(updated);
    setNewTask("");
    setDueDate("");
    setClient("");
  };

  const filteredTasks = currentTasks.filter(t => t.title.includes(search) || t.client.includes(search));

  return (
    <div className={darkMode ? "dark bg-gradient-to-br from-gray-800 to-gray-900 text-white min-h-screen p-4 sm:p-6 space-y-6" : "bg-gradient-to-br from-pink-100 to-yellow-100 text-gray-800 min-h-screen p-4 sm:p-6 space-y-6"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="text-sm font-semibold tracking-wide">📂 現在のボード: {activeProject} | 🌟 完了率: {completionRate}%（{doneTasks}/{currentTasks.length}）</div>
        <Button onClick={() => setDarkMode(!darkMode)} className="rounded-full px-4 py-1 text-xs bg-white text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white">
          {darkMode ? "☀️ ライトモード" : "🌙 ダークモード"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {projectNames.map(name => (
          <Button
            key={name}
            onClick={() => setActiveProject(name)}
            className={`text-xs rounded-full px-3 py-1 ${activeProject === name ? "bg-pink-500 text-white" : "bg-white text-black hover:bg-gray-200"}`}
          >
            {name}
          </Button>
        ))}
      </div>

      <Input
        placeholder="🔍 タスク名またはクライアント名で検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-pink-300 rounded-xl px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      <div className="grid gap-3 sm:gap-5 mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Input
          placeholder="✨ 新しいタスク"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="rounded-xl px-4 py-2 border border-yellow-300 bg-white shadow-sm w-full"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl px-4 py-2 border border-yellow-300 bg-white shadow-sm w-full"
        />
        <Input
          placeholder="🎨 クライアント名 (例: A, B, C)"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="rounded-xl px-4 py-2 border border-yellow-300 bg-white shadow-sm w-full"
        />
        <Button onClick={addTask} className="bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl px-4 py-2 transition-all shadow-md w-full">＋ 追加</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task, idx) => (
          <Card key={idx} className="bg-white rounded-xl shadow p-4">
            <CardContent className="p-0">
              <div className="font-semibold text-lg">{task.title}</div>
              <div className="text-sm text-gray-500">期限: {task.due} | クライアント: {task.client}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}