import { useState } from 'react';
import {  BaseError, ContractFunctionRevertedError } from 'viem';
import type {Address} from 'viem';
import { TODO_ABI, celoToDoContractAddress } from '@/lib/constants/contract';
import { publicClient, walletClient } from '@/lib/client';

interface CompleteTaskProps {
    accounts: Array<Address>;
}

function CompleteTask({ accounts }: CompleteTaskProps) {
    const [taskId, setTaskId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentAccount, setCurrentAccount] = useState<`0x${string}` | null>(null);

    const connectAccount = async () => {
        try {
            if (accounts.length === 0) {
                const [address] = await walletClient.requestAddresses();
                setCurrentAccount(address);
                return address;
            } else {
                setCurrentAccount(accounts[0]);
                return accounts[0];
            }
        } catch (errors) {
            console.error('Error connecting wallet:', errors);
            throw errors;
        }
    }


    const completeTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskId.trim()) {
            setError('Please enter a task ID');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const account = !currentAccount ? await connectAccount() : currentAccount;

            const taskIdNum = parseInt(taskId, 10);
            if (isNaN(taskIdNum) || taskIdNum < 0) {
                throw new Error('Please enter a valid task ID (positive number)');
            }

            const taskIdBigInt = BigInt(taskIdNum);

            const { result } = await publicClient.simulateContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'completeTask',
                args: [taskIdBigInt],
                account: account,
            });

            console.log('Simulation result:', result);

            const hash = await walletClient.writeContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'completeTask',
                args: [taskIdBigInt],
                account: account,
            });
            console.log('Transaction hash:', hash);
            console.log('Waiting for confirmation...');

            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                confirmations: 5,
                timeout: 60_000,
            });
            console.log('Reciept status: ', receipt.status);
            console.log('Transaction confirmed in block:', receipt.blockNumber);

            const latestBlock = await publicClient.getBlockNumber();
            console.log('Latest block:', latestBlock);

            const fromBlock = receipt.blockNumber > 2n ? receipt.blockNumber - 2n : 0n;
            const toBlock = receipt.blockNumber + 2n > latestBlock ? latestBlock : receipt.blockNumber + 2n;

            console.log(`Querying events from block ${fromBlock} to ${toBlock}`);

            const logs = await publicClient.getContractEvents({
                abi: TODO_ABI,
                address: celoToDoContractAddress,
                eventName: 'TaskCompleted',
                fromBlock,
                toBlock
            });

            console.log('Found events:', logs);

            if (logs.length === 0) {
                console.warn('No TaskCreated events found in the queried blocks');
                // Try one more time with just the transaction's block
                try {
                    const singleBlockLogs = await publicClient.getContractEvents({
                        abi: TODO_ABI,
                        address: celoToDoContractAddress,
                        eventName: 'TaskCompleted',
                        fromBlock: receipt.blockNumber,
                        toBlock: receipt.blockNumber
                    });
                    console.log('Single block query results:', singleBlockLogs);
                } catch (err) {
                    console.warn('Error querying single block:', err);
                }
            } else {
                console.log('TaskCreated event data:', logs[0].args);
            }

            if (receipt.status === 'success') {
                setSuccess('Task completed successfully! ' + 'ID: ' + logs[0].args.id);
                setTaskId('');
                setLoading(false);
            } else {
                setError('Transaction reverted');
                setLoading(false);
            }

        } catch (err) {
            console.error('Error:', err);
            if (err instanceof BaseError) {
                const revertError = err.walk(er => er instanceof ContractFunctionRevertedError);
                if (revertError instanceof ContractFunctionRevertedError) {
                    const errorName = revertError.reason ?? 'Unknown error';
                    setError('Transaction failed: ' + errorName);
                } else {
                    setError('Transaction failed: ' + err.message);
                }
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <div className='max-w-md mx-auto rounded-xl shadow-xl overflow-hidden md:max-w-2xl p-6'>
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold">Complete Task</h1>
                </div>

                <form onSubmit={completeTask} className="space-y-6">
                    <div>
                        <label htmlFor="taskId" className="text-start block text-sm font-medium mb-2">
                            Task ID to Complete
                        </label>
                        <input
                            type="number"
                            id="taskId"
                            min="0"
                            value={taskId}
                            onChange={(e) => setTaskId(e.target.value)}
                            placeholder="Enter task ID"
                            className="w-full p-2 border border-gray-700 rounded-md"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Completing Task...' : 'Mark as Complete'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                            <p>{success}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CompleteTask;
