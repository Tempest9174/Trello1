import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Task } from '../types/Task';

type Props = {
  task: Task;
  onUpdated: (task: Task) => void;
  onDeleted: () => void;
  onClose: () => void;
};

export function TaskEditModal({ task, onUpdated, onDeleted, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${task.id}`);
      toast.success('タスクを削除しました');
      onDeleted();
    } catch {
      toast.error('削除に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.put<Task>(`http://localhost:8080/api/tasks/${task.id}`, {
        title,
        description: description || null,
        priority,
        dueDate: dueDate || null,
      });
      toast.success('タスクを更新しました');
      onUpdated(res.data);
    } catch {
      toast.error('更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-700">タスクを編集</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                優先度 <span className="text-red-500">*</span>
              </label>
              <select
                title="優先度"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
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
                title="期限日"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">本当に削除しますか？</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  削除する
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  戻る
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
              >
                削除
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
