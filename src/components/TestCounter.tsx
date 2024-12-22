import { useState } from 'react'

export default function TestCounter() {
	const [count, setCount] = useState(0)
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold">
				I'm a <span className="text-blue-500">React</span> counter component
			</h1>
			<h2 className="w-full px-6 py-4 text-center font-mono text-xl">Count: {count}</h2>
			<button
				className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				onClick={() => setCount(count + 1)}>
				Increment
			</button>
			<p className="text-sm text-gray-500">
				Don't get too excited, this is just a test.
				<br />
				Soon ill be out of here.
			</p>
		</div>
	)
}
