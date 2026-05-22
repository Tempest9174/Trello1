export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  status: Status;
  position: number;
  createdAt: string;
  updatedAt: string;
};
