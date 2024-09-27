export default function Modal({ ...pageProps }) {
	const { isOpen, handleDeleteConfirmTodo, deleteId } = pageProps;

	return (
		<>
			<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
				Delete this ID: {deleteId}
				<div className="mt-2">
					<p className="text-sm text-gray-500">
						Are you sure you want to permanently remove this ID: {deleteId}
					</p>
				</div>
				<div className="flex space-x-2">
					<div className="mt-4">
						<button
							type="button"
							className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
							onClick={() => handleDeleteConfirmTodo(false, deleteId)}
						>
							Cancel
						</button>
					</div>
					<div className="mt-4">
						<button
							type="button"
							className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
							onClick={() => handleDeleteConfirmTodo(true, deleteId)}
						>
							Yes
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
