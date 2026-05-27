import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task, Priority, Status } from '../types/Task';

const priorityStyle: Record<Priority, string> = {
  HIGH:   'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW:    'bg-green-100 text-green-700',
};

const priorityLabel: Record<Priority, string> = {
  HIGH:   '高',
  MEDIUM: '中',
  LOW:    '低',
};

const statusStyle: Record<Status, string> = {
  TODO:        'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE:        'bg-emerald-100 text-emerald-700',
};

const statusLabel: Record<Status, string> = {
  TODO:        '未着手',
  IN_PROGRESS: '進行中',
  DONE:        '完了',
};

type Props = {
  task: Task;
  onClick: () => void;
};

export function TaskCard({ task, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyle[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[task.status]}`}>
          {statusLabel[task.status]}
        </span>
      </div>

      <p className="text-gray-900 font-medium mb-1">{task.title}</p>

      {task.description && (
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-gray-400 text-xs">期限：{task.dueDate}</p>
      )}
    </div>
  );
}
