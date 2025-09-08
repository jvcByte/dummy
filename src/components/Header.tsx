import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { accounts, connectAccount } from '@/lib/constants/helper-functions'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-transparent justify-between">
      <nav className="flex flex-row justify-between w-full items-center">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
        <div>
          {accounts.length > 0 ? (
            <p>Connected wallet: {accounts[0]}</p>
          ) : (
            <Button
              onClick={connectAccount}
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
