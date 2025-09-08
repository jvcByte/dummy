# ToDo with Viem

A decentralized ToDo application built on the Celo blockchain using Viem, React, and TypeScript. This application demonstrates how to interact with smart contracts on the Celo testnet (Alfajores) for managing tasks in a decentralized manner.

## Features

- 🌐 Connect your Web3 wallet (like MetaMask)
- 📝 Create new tasks on the blockchain
- ✅ Mark tasks as completed
- ✏️ Update existing tasks
- 🔍 View task with ID
- 🔒 Secure blockchain transactions with proper error handling

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Viem, Celo Testnet (Alfajores)
- **Routing**: TanStack Router
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier

## Project Structure

```
src/
├── components/               # Reusable UI components
│   ├── ui/                   # UI component library
│   │   ├── button.tsx        # Button component
│   │   └── input.tsx         # Input component
│   ├── CreateTask.tsx        # Form to create new tasks
│   ├── CompleteTask.tsx      # Mark tasks as completed
│   ├── UpdateTask.tsx        # Update task descriptions
│   ├── GetTask.tsx           # View task details by ID
│   └── Header.tsx            # Navigation header
├── lib/
│   ├── constants/
│   │   └── contract.ts       # Contract ABI and addresses
│   ├── client.ts             # Viem client configuration
├── routes/                   # Application routes
│   ├── _root.tsx             # Root layout
│   └── index.tsx             # Root component
├── reportWebVitals.ts        # Web Vitals reporting
├── routeTree.gen.ts          # Generated route tree
├── styles.css                # Global styles
└── main.tsx                  # Application entry point
```

## Smart Contract

The application interacts with a smart contract on the Celo Alfajores testnet with the following features:

- **Events**:
  - `TaskCreated(uint256 id, string description)`
  - `TaskCompleted(uint256 id)`
  - `TaskUpdated(uint256 id, string description)`

- **Contract Address**: `0x9e0B679c7f92a53D496883C7B1a3e21B085dF41b`

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A Web3 wallet (like MetaMask) connected to Celo Alfajores testnet

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/jvcByte/ToDoWithViem.git](https://github.com/jvcByte/ToDoWithViem.git)
   cd ToDoWithViem
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Connecting to Celo Testnet

1. Add Celo Alfajores Testnet to your wallet:

   - Network Name: Celo Alfajores Testnet
   - RPC URL: https://alfajores-forno.celo-testnet.org
   - Chain ID: 44787
   - Currency Symbol: CELO
   - Block Explorer URL: https://alfajores-blockscout.celo-testnet.org
   - Get test CELO from the Celo Faucet

2. Usage

  2.1 Create a Task
   - Enter a task description and click "Create Task"
   - Confirm the transaction in your wallet
   - Wait for the transaction to be confirmed

  2.2 Complete a Task
   - Enter the task ID and click "Mark as Complete"
   - Confirm the transaction in your wallet

  2.3 Update a Task
   - Enter the task ID and new description
   - Click "Update Task"
   - Confirm the transaction in your wallet

  2.4 View Tasks
   - Your tasks will be displayed in the GetTask component
   - Each task shows its ID, description, and completion status

### Error Handling

The application includes error handling for:

- Wallet connection issues
- Transaction failures
- Invalid inputs
- Network errors

### Testing

Run tests with:

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
- [Viem](https://viem.sh/) for the TypeScript interface for Ethereum
- [Celo](https://celo.org/) for the blockchain platform
- [TanStack](https://tanstack.com/) for the router and other utilities