import { useState } from 'react';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import type { FormEvent } from 'react';
import type { Address } from 'viem';
import { TODO_ABI, celoToDoContractAddress } from '@/lib/constants/contract';
import { publicClient, walletClient } from '@/lib/client';
import { connectAccount } from '@/lib/constants/helper-functions';

interface CreateTaskProps {
    accounts: Array<Address>;
}

function CreateTask({ accounts }: CreateTaskProps) {
    const [currentAccount, setCurrentAccount] = useState<`0x${string}` | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const createTask = async (e: FormEvent) => {
        e.preventDefault();

        if (accounts.length <= 0) {
            setCurrentAccount(await connectAccount());
        }

        if (!description.trim()) {
            setError('Please enter a task description');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');


            const { result } = await publicClient.simulateContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'createTask',
                args: [description],
                account: currentAccount,
            });

            console.log('Simulation result:', result);

            const hash = await walletClient.writeContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'createTask',
                args: [description],
                account: currentAccount,
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
                eventName: 'TaskCreated',
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
                        eventName: 'TaskCreated',
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
                setSuccess('Task created successfully! ' + 'ID: ' + logs[0].args.id + ' Description: ' + logs[0].args.description);
                setDescription('');
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
                    <h1 className="text-xl font-bold">Create New Task</h1>
                </div>

                <form onSubmit={createTask} className="space-y-6">
                    <div>
                        <label htmlFor="description" className="text-start block text-sm font-medium mb-2">
                            Task Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="w-full p-2 border border-gray-700 rounded-md"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Creating Task...' : 'Create Task'}
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

export default CreateTask;
