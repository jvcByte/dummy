import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Copy, Wallet } from 'lucide-react'
import { Button } from './ui/button'
import { accounts, connectAccount } from '@/lib/constants/helper-functions'

export default function Header() {
  const [connectedAccounts, setConnectedAccounts] = useState<Array<string>>([])

  useEffect(() => {
    setConnectedAccounts([...accounts])
  }, [accounts.length])

  const handleConnect = async () => {
    await connectAccount()
    setConnectedAccounts([...accounts])
  }

  return (
    <header className="p-2 flex gap-2 bg-transparent justify-between">
      <nav className="flex flex-row justify-between w-full items-center">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
        <div>
          {connectedAccounts.length > 0 ? (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 border-2 border-gray-300 shadow-md">
              <Wallet className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                {`${connectedAccounts[0].slice(0, 6)}...${connectedAccounts[0].slice(-4)}`}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(connectedAccounts[0])
                  toast.success('Address copied to clipboard')
                }}
                className="text-gray-700 hover:text-blue-700 dark:hover:text-gray-200 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              className="bg-blue-500 hover:bg-blue-600 text-white text-base"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
