import { createFileRoute } from '@tanstack/react-router'
import GetTask from '@/components/GetTask'
import CreateTask from '@/components/CreateTask'
import { accounts, getAccounts } from '@/lib/constants/helper-functions'
import CompleteTask from '@/components/CompleteTask'
import UpdateTask from '@/components/UpdateTask'


export const Route = createFileRoute('/')({
  component: App,
})



function App() {
  getAccounts();
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-10 mb-2">ToDo App with Viem</h1>
      <div className="flex flex-col md:flex-row justify-center gap-4 p-6">
        <div className="w-full md:w-1/3">
          <GetTask />
        </div>
        <div className="w-full md:w-1/3">
          <CreateTask accounts={accounts} />
        </div>
        <div className="w-full md:w-1/3">
          <CompleteTask accounts={accounts} />
        </div>
        <div className="w-full md:w-1/3">
          <UpdateTask accounts={accounts} />
        </div>
      </div>
    </div>
  )
}
