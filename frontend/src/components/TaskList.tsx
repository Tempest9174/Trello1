import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Task, Status } from '../types/Task';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskEditModal } from './TaskEditModal';

const COLUMNS: { status: Status; label: string; color: string }[] = [
  { status: 'TODO',        label: '未着手', color: 'bg-gray-100 text-gray-600' },
  { status: 'IN_PROGRESS', label: '進行中', color: 'bg-blue-100 text-blue-700' },
  { status: 'DONE',        label: '完了',   color: 'bg-emerald-100 text-emerald-700' },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    axios
      .get<Task[]>('http://localhost:8080/api/tasks')
      .then((res) => setTasks(res.data))
      .catch(() => setError('タスクの取得に失敗しました。バックエンドが起動しているか確認してください。'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setShowForm(false);
  };

  const handleUpdated = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {showForm ? (
        <TaskForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          ＋ タスクを追加
        </button>
      )}

      <div className="grid grid-cols-3 gap-6">
        {COLUMNS.map(({ status, label, color }) => {
          const grouped = tasks.filter((t) => t.status === status);
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
                  {label}
                </span>
                <span className="text-xs text-gray-400">{grouped.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {grouped.length === 0 ? (
                  <p className="text-gray-300 text-sm text-center py-8">なし</p>
                ) : (
                  grouped.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onUpdated={handleUpdated}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
}
