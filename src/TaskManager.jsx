// ✅ Firestore保存＆ユーザー名＋アイコン表示対応版
import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "./firebase";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

const themes = {
  blue: "from-white to-blue-100 text-gray-900",
  pink: "from-pink-100 to-red-100 text-gray-900",
  green: "from-green-100 to-teal-100 text-gray-900",
  dark: "from-gray-900 to-gray-800 text-white"
};

export default function TaskManager() {
  const [user, setUser] = useState(null);
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
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "tasks", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTasks(data.tasks || []);
          setClientList(data.clients || ["クライアントA", "クライアントB"]);
        }
      } else {
        setTasks([]);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "tasks", user.uid);
      setDoc(docRef, {
        tasks,
        clients: clientList
      });
    }
  }, [tasks, clientList, user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("ログインに失敗しました");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100">
        <Button onClick={handleLogin} className="text-lg px-6 py-3">Googleでログイン</Button>
      </div>
    );
  }

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
        <div className="flex items-center gap-3">
          <img src={user.photoURL} alt="icon" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium">{user.displayName}</span>
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
          <Button onClick={handleLogout}>ログアウト</Button>
        </div>
      </div>

      {/* 以下略（UIとロジックに変更なし） */}
    </div>
  );
}
