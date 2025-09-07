import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <h1>ToDo With Viem</h1>

      <div className="flex justify-center flex-wrap gap-6">

        <div className="flex flex-col w-1/3 border border-gray-200 p-2 rounded-md">
          <label htmlFor="" className="text-left">Add a todo</label>
          <div className="flex flex-col gap-4">
            <Input type='text' placeholder='Add a todo' />
            <Button>Submit</Button>
          </div>
        </div>

        <div className="flex flex-col w-1/3 border border-gray-200 p-2 rounded-md">
          <Input type='text' placeholder='Add a todo' />
        </div>

        <div className="flex flex-col w-1/3 border border-gray-200 p-2 rounded-md">
          <Input type='text' placeholder='Add a todo' />
        </div>

        <div className="flex flex-col w-1/3 border border-gray-200 p-2 rounded-md">
          <Input type='text' placeholder='Add a todo' />
        </div>
      </div>
     
    </div>
  )
}
