import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Frontend recruitment task</h1>
      <p className="mt-2 text-sm text-slate-600">
        TailwindCSS v3 + shadcn/ui base is installed. State: Zustand. Utilities:
        Ramda.
      </p>
      <div className="mt-6 flex gap-3">
        <Button>shadcn/ui Button</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  )
}

export default App
