import { Outlet } from 'react-router-dom'

export default function PageWrapper(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Thesis Guidelines Evaluator</h1>
        </header>
        <main className="bg-white rounded-lg shadow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
