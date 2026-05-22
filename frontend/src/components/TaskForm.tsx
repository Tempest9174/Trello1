import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Task } from '../types/Task';

type Props = {
  onCreated: (task: Task) => void;
  onCancel: () => void;
};

export function TaskForm({ onCreated, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post<Task>('http://localhost:8080/api/tasks', {
        title,
        description: description || null,
        priority,
        dueDate: dueDate || null,
      });
      toast.success('タスクを登録しました');
      onCreated(res.data);
    } catch {
      toast.error('登録に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6"
    >
      <h3 className="text-base font-semibold text-gray-700 mb-4">新しいタスク</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="タスクのタイトル"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="タスクの説明（任意）"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            優先度 <span className="text-red-500">*</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="HIGH">高</option>
            <option value="MEDIUM">中</option>
            <option value="LOW">低</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">期限日</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '登録中...' : '登録する'}
        </button>
      </div>
    </form>
  );
}
