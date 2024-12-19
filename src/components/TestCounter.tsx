import { useState } from "react";

export default function TestCounter() {
    const [count, setCount] = useState(0);
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">I'm a <span className="text-blue-500">React</span> counter component</h1>
            <h2 className="text-xl font-mono py-4 px-6 w-full text-center">Count: {count}</h2>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCount(count + 1)}
            >
                Increment
            </button>
            <p className="text-sm text-gray-500">
                Don't get too excited, this is just a test.<br />Soon ill be out of here.
            </p>
        </div>
    );
}
