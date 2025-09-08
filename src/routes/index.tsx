import { createFileRoute } from '@tanstack/react-router'
import GetTask from '@/components/GetTask'
import CreateTask from '@/components/CreateTask'
import { walletClient } from '@/lib/client'
import CompleteTask from '@/components/CompleteTask'


export const Route = createFileRoute('/')({
  component: App,
})

let accounts: Array<`0x${string}`> = [];

async function getAccounts() {
  accounts = await walletClient.getAddresses();
  if (accounts.length > 0) {
    console.log('Connected wallet:', accounts[0]);
  } else {
    alert('No wallet connected');
    console.log('No wallet connected');
  }
}

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
          <CompleteTask accounts={accounts} />
        </div>
      </div>
    </div>
  )
}
