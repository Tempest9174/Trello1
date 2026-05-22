import { TaskList } from './components/TaskList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">タスク管理</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">タスク一覧</h2>
        <TaskList />
      </main>
    </div>
  );
}

export default App;
