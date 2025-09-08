import { useState } from 'react';
import { BaseError, ContractFunctionRevertedError } from 'viem';
import { TODO_ABI, celoToDoContractAddress } from '@/lib/constants/contract';
import { publicClient } from '@/lib/client';

function GetTask() {
    const [task, setTask] = useState<{
        id: bigint;
        description: string;
        completed: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [taskId, setTaskId] = useState('');
    const [error, setError] = useState('');

    const getTask = async () => {
        if (!taskId.trim()) {
            setError('Please enter a task ID');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const taskIdBigInt = BigInt(taskId);

            const response = await publicClient.readContract({
                address: celoToDoContractAddress,
                abi: TODO_ABI,
                functionName: 'getTask',
                args: [taskIdBigInt],
            });

            const taskData = response;
            console.log("taskData: ", taskData);

            setTask({
                id: taskData.id,
                description: taskData.description,
                completed: taskData.completed
            });

        } catch (err) {
            console.error('Error:', err);
            if (err instanceof BaseError) {
                const revertError = err.walk(e => e instanceof ContractFunctionRevertedError)
                if (revertError instanceof ContractFunctionRevertedError) {
                    const errorName = revertError.reason ?? 'Unknown error'
                    setError('Error fetching task: ' + errorName);
                    setTask(null);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <div className="max-w-md mx-auto rounded-xl shadow-xl overflow-hidden md:max-w-2xl p-6">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold">Get Task</h1>
                </div>

                <div className="flex flex-col gap-6 mb-6">
                    <input
                        type="number"
                        min="0"
                        required
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                        placeholder="Enter task ID"
                        className="border border-gray-700 rounded-md p-2"
                    />
                    <button
                        onClick={getTask}
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Get Task'}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                {task && (
                    <div className="p-6 rounded-lg border border-gray-600">
                        <h2 className="text-xl font-semibold mb-4 text-gray-300">Task Details</h2>
                        <div className="space-y-3">
                            <div className='flex justify-start gap-2'>
                                <span className="font-medium">Task ID :</span>{' '}
                                <span className="">{task.id}</span>
                            </div>
                            <div className='flex justify-start gap-2'>
                                <span className="font-medium">Description :</span>{' '}
                                <span className="">{task.description}</span>
                            </div>
                            <div className="flex justify-start gap-2">
                                <span className="font-medium">Status :</span>{' '}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${task.completed
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {task.completed ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetTask;