// ✅ クライアント名を選択式に変更＆自分で追加できるように対応
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const projectNames = ["すべてのタスク", "プロジェクトA", "プロジェクトB"];

const themes = {
  blue: "from-white to-blue-100 text-gray-900",
  pink: "from-pink-100 to-red-100 text-gray-900",
  green: "from-green-100 to-teal-100 text-gray-900",
  dark: "from-gray-900 to-gray-800 text-white"
};

export default function TaskManager() {
  const [activeProject, setActiveProject] = useState("すべてのタスク");
  const [theme, setTheme] = useState("blue");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [client, setClient] = useState("");
  const [newClient, setNewClient] = useState("");
  const [clientList, setClientList] = useState(["クライアントA", "クライアントB"]);
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

  const addClient = () => {
    if (!newClient.trim() || clientList.includes(newClient.trim())) return;
    setClientList([...clientList, newClient.trim()]);
    setNewClient("");
  };

  const filteredTasks = currentTasks.filter(t => t.title.includes(search) || t.client.includes(search));

  return (
    <div className={`bg-gradient-to-br ${themes[theme]} min-h-screen p-4 sm:p-6 space-y-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="text-sm font-semibold tracking-wide">
          📂 現在のボード: {activeProject} | 🌟 完了率: {completionRate}%（{doneTasks}/{currentTasks.length}）
        </div>
        <div className="flex gap-2 items-center">
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
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {projectNames.map(name => (
          <Button
            key={name}
            onClick={() => setActiveProject(name)}
            className={`text-xs rounded-full px-3 py-1 ${
              activeProject === name
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-200"
            }`}
          >
            {name}
          </Button>
        ))}
      </div>

      <Input
        placeholder="🔍 タスク名またはクライアント名で検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-blue-300 rounded-xl px-4 py-2 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="rounded-xl px-4 py-2 border border-blue-300 bg-white text-black shadow-sm w-full"
        >
          <option value="">🎨 クライアントを選択</option>
          {clientList.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <Button onClick={addTask} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-4 py-2 transition-all shadow-md w-full">＋ 追加</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="➕ クライアントを追加"
          value={newClient}
          onChange={(e) => setNewClient(e.target.value)}
          className="rounded-xl px-4 py-2 border border-gray-300 bg-white text-black shadow-sm w-full"
        />
        <Button onClick={addClient} className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl px-4 py-2 transition-all shadow-md">追加</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task, idx) => (
          <Card key={idx} className="bg-white rounded-xl shadow p-4">
            <CardContent className="p-0">
              <div className="font-semibold text-lg text-black">{task.title}</div>
              <div className="text-sm text-gray-600">期限: {task.due} | クライアント: {task.client}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
