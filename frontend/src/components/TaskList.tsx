import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Task } from '../types/Task';
import { TaskCard } from './TaskCard';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Task[]>('http://localhost:8080/api/tasks')
      .then((res) => setTasks(res.data))
      .catch(() => setError('タスクの取得に失敗しました。バックエンドが起動しているか確認してください。'))
      .finally(() => setLoading(false));
  }, []);

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

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
