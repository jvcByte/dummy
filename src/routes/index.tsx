import { createFileRoute } from '@tanstack/react-router'
import GetTask from '@/components/GetTask'


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    // <div className='w-[100vw] h-[100vh] text-white px-8 py-4'>
    //   <Header accounts={accounts} />
    //   {accounts.length > 0 ? (
    //     <div className="mt-6 p-4 bg-green-50 rounded-lg">
    //       <p className="font-medium text-green-800">Connected Wallet:</p>
    //       <p className="text-sm font-mono text-gray-600 break-all">{accounts[0]}</p>
    //     </div>
    //   ) : (
    //     <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-center">
    //       <p className="text-yellow-800 mb-2">Wallet not connected</p>
    //       <button
    //         onClick={connectWallet}
    //         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    //       >
    //         Connect Wallet
    //       </button>
    //     </div>
    //   )}

    //   <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full p-4'>
    //     <div className="w-full">
    //       <CreateTask accounts={accounts} />
    //     </div>
    //     <div className="w-full">
    //       <GetTask />
    //     </div>
    //     <div className="w-full">
    //       <CompleteTask accounts={accounts} />
    //     </div>
    //     <div className="w-full">
    //       <UpdateTask accounts={accounts} />
    //     </div>
    //   </div>
    // </div>

    <div>
      Todo

      <GetTask />
    </div>
  )
}
