import { useState } from 'react';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import type { Address } from 'viem';
import { TODO_ABI, celoToDoContractAddress } from '@/lib/constants/contract';
import { publicClient, walletClient } from '@/lib/client';

interface CreateTaskProps {
    accounts: Array<Address>;
}

function CreateTask({ accounts }: CreateTaskProps) {
    const [currentAccount, setCurrentAccount] = useState<`0x${string}` | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim()) {
            setError('Please enter a task description');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess(false);
            const account = !currentAccount ? await connectAccount() : currentAccount;


            const { result } = await publicClient.simulateContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'createTask',
                args: [description],
                account: account,
            });

            console.log('Simulation result:', result);

            const hash = await walletClient.writeContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'createTask',
                args: [description],
                account: account,
            });
            console.log('Transaction hash:', hash);

            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                confirmations: 1,
                timeout: 60_000,
            });
            console.log('Reciept status: ', receipt.status);

            if (receipt.status === 'success') {
                setSuccess(true);
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
                            <p>Task created successfully! The transaction is being processed.</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CreateTask;
