import React, { useState, useEffect, ChangeEvent } from "react";
import {
	TrashIcon,
	PencilIcon,
	ClipboardListIcon,
	SaveIcon,
	CollectionIcon,
	BackspaceIcon,
	LogoutIcon,
	LoginIcon,
} from "@heroicons/react/solid";
import Modal from "./components/Modal";
import _, { isEmpty } from "lodash";
import uniqid from "uniqid";
import toast, { Toaster } from "react-hot-toast";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Calendar } from "@/components/ui/calendar";

import { Switch } from "@/components/ui/switch";
import { format } from "date-fns"; // Optional: for formatting the date

import {
	setDoc,
	doc,
	deleteDoc,
	query,
	orderBy,
	limit,
	getDocs,
	collection,
	Timestamp,
	addDoc,
	updateDoc,
} from "firebase/firestore"; // Import addDoc

import { db } from "../lib/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

interface Todo {
	id: string;
	title: string;
	description: string;
	status: boolean;
	nstatus: boolean;
	date: string;
	todo: object;
}

interface StateManagement {
	todos: Todo[];
	// Add other properties if needed
}
function StateManagement({ ...pageProps }) {
	const todoDefault: Todo = {
		id: "",
		title: "",
		description: "",
		status: false,
		nstatus: false,
		date: "",
		todo: [],
	};
	const [isEdit, setIsEdit] = useState<Todo>();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(false);
	const [date, setDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date()); // State to store selected date
	const [isLogged, setIsLogged] = useState(false);
	const router = useRouter(); // To handle redirection after logout

	useEffect(() => {
		const auth = getAuth();

		// Check for authentication state change
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setIsLogged(true); // User is logged in
			} else {
				setIsLogged(false); // User is logged in
				router.push("/signin"); // Redirect to login if not logged in
			}
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	const getLocalStorage = (name: any) => {
		if (typeof window !== "undefined") {
			return localStorage.getItem(name);
		}
	};

	const setLocalStorage = (name: any, value: any) => {
		if (typeof window !== "undefined") {
			localStorage.setItem(name, value);
		}
	};

	/*const [stateManagement, setStateManagement] = useState(() => {
		const stateManagementLocalStorage = getLocalStorage("stateManagement");
		return stateManagementLocalStorage
			? JSON.parse(stateManagementLocalStorage)
			: {
					//theme: "light",
					todos: {},
					tasks: {},
			  };
	});*/

	const [stateManagement, setStateManagement] = useState<StateManagement>();

	const [isTitleEmpty, setIsTitleEmpty] = useState(false);

	async function fetchLimitedUsers() {
		const usersCollectionRef = collection(db, "pocheng");
		//const q = query(usersCollectionRef, orderBy("createdAt"), limit(5)); // Change 'createdAt' to your field name
		const q = query(usersCollectionRef); // Change 'createdAt' to your field name

		const snapshot = await getDocs(q);

		const limitedUsersList = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return limitedUsersList;
	}

	useEffect(() => {
		const loadUsers = async () => {
			try {
				const usersData = await fetchLimitedUsers(); // Change this to fetchActiveUsers or fetchLimitedUsers as needed

				setStateManagement((prevStateManagement: any) => {
					return {
						...prevStateManagement, // to preserve all the states
						todos: usersData,
					};
				});
			} catch (err) {
				//console.log(err.message);
			}
		};

		loadUsers();

		/*if (stateManagement && typeof window !== "undefined") {
			setLocalStorage("stateManagement", JSON.stringify(stateManagement));
		}*/
	}, []);

	const auth = getAuth();

	const handleSaveTodos = async (e: any) => {
		e.preventDefault();

		const auth = getAuth();
		const user = auth.currentUser;

		if (!user) {
			console.error("User not authenticated. Cannot add document.");
			return; // Prevents the function from executing if the user is not authenticated
		}

		let id = isEdit?.id || uniqid.time();
		const title = e.target.title.value;
		const desc = e.target.desc.value;
		const nstatus = status ? true : false;
		const date = String(selectedDate).replace(
			"GMT+0800 (Philippine Standard Time)",
			""
		);

		// check if fields is empty
		if (_.isEmpty(title)) {
			setIsTitleEmpty(true);
			return;
		}
		try {
			const data = {
				uid: user.uid,
				id: id,
				title: title,
				description: desc,
				status: nstatus,
				date: date,
			};

			if (isEdit?.id) {
				await updateDoc(doc(db, "pocheng", id), data);

				// update state
				setStateManagement((prevStateManagement: any) => {
					const updatedTodos = prevStateManagement.todos.map((todo: any) => {
						if (todo.id === id) {
							// Return a new object with the updated value
							return { ...todo, ...data };
						}
						return todo; // Keep the other todos unchanged
					});

					return {
						...prevStateManagement, // to preserve all the states
						todos: updatedTodos,
					};
				});
			} else {
				await setDoc(doc(db, "pocheng", id), data);

				// save state
				setStateManagement((prevStateManagement: any) => {
					return {
						...prevStateManagement, // to preserve all the states
						todos: [
							...prevStateManagement.todos, // get the current todo
							data, // add new item
						],
					};
				});
			}

			//console.log("Document written with ID: ", docRef.id);

			if (todoDefault) {
				setTitle("");
				setDescription("");
				setStatus(false);
				setIsEdit(todoDefault);
			}

			toast.success("Successfully added pocheng");
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};

	const handleDeleteTodo = (id: any) => {
		setIsOpen(true);
		setDeleteId(id);
	};

	const handleDeleteConfirmTodo = async (confirmation: any, id: any) => {
		if (confirmation) {
			const docRef = doc(db, "pocheng", id); // Change 'users' to your collection name

			try {
				await deleteDoc(docRef);

				setStateManagement((prevStateManagement: any) => {
					return {
						...prevStateManagement,
						todos: prevStateManagement.todos.filter(
							(item: any) => item.id != id
						),
					};
				});

				setIsOpen(false);

				console.log("Document deleted successfully");
			} catch (error) {
				console.error("Error deleting document: ", error);
			}
		} else {
			setIsOpen(false);
		}
	};

	const handleEditTodo = (id: any) => {
		const index =
			stateManagement?.todos.findIndex((todo) => todo.id == id) || 0;
		const todo = stateManagement?.todos[index];
		console.log("todo", todo);
		if (todo) {
			setTitle(todo.title);
			setDescription(todo.description);
			setStatus(todo.status);
			setIsEdit(todo);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const inlineUpdateStatus = async (id: any, status: any) => {
		try {
			const data = {
				status: !status,
			};
			await updateDoc(doc(db, "pocheng", id), data);

			setStateManagement((prevStateManagement: any) => {
				const updatedTodos = prevStateManagement.todos.map((todo: any) => {
					if (todo.id === id) {
						// Return a new object with the updated value
						return { ...todo, ...data };
					}
					return todo; // Keep the other todos unchanged
				});

				return {
					...prevStateManagement, // to preserve all the states
					todos: updatedTodos,
				};
			});
		} catch (e) {}
	};

	const [todoLists, setTodoLists] = useState();
	useEffect(() => {
		let todos: any;
		if (!isEmpty(stateManagement?.todos)) {
			todos = _.sortBy(stateManagement?.todos, ["date"]).map((v: any, k) => {
				let checked = false;
				let statusClass = "bg-red-500";
				if (v.status) {
					statusClass = "bg-green-500";
					checked = true;
				}

				return (
					<tr
						key={k}
						className={` bg-white hover:bg-gray-100 ${
							v.status ? "line-through" : ""
						}`}
					>
						<td className="py-5 px-3 align-top">{v.title}</td>
						<td className="flex flex-col py-5 px-3 align-top">
							<p>{format(v.date, "MMM dd, yyyy") || "--"}</p>
							<p>{v.description || "--"}</p>
						</td>
						<td className="hidden py-5 px-3 text-center text-sm align-top">
							<label
								htmlFor={`status_${v.id}`}
								className="flex items-center cursor-pointer"
							>
								<div className="relative">
									<Switch
										checked={v.status}
										onCheckedChange={() => inlineUpdateStatus(v.id, v.status)}
									/>

									{/*<input
									id={`status_${v.id}`}
									onChange={() => inlineUpdateStatus(v.id, v.status)}
									name={`status_${v.id}`}
									type="checkbox"
									checked={checked}
									className="sr-only"
								/>
								<div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
								<div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                */}
								</div>
							</label>
						</td>
						<td className="hidden py-5 px-3 max-w-xs align-top">
							{format(v.date, "MMM dd, yyyy") || "--"}
						</td>
						<td className="py-5 px-3 align-top w-fit">
							<div className="flex gap-4 justify-start items-center w-fit">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<button
											onClick={() => handleDeleteTodo(v.id)}
											className="w-6 h-6 text-red-600"
										>
											<TrashIcon />
										</button>
									</AlertDialogTrigger>
									<AlertDialogContent className="bg-white">
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This will permanently deleted
												<b className=" capitalize mx-1">({v.title}).</b>
												This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleDeleteConfirmTodo(true, v.id)}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<button
									onClick={() => handleEditTodo(v.id)}
									className="w-6 h-6"
								>
									<PencilIcon />
								</button>

								<Switch
									checked={v.status}
									onCheckedChange={() => inlineUpdateStatus(v.id, v.status)}
								/>
							</div>
						</td>
					</tr>
				);
			});
		}
		setTodoLists(todos);
	}, [stateManagement]);

	const onChangeStatus = (checked: any) => {
		console.log("onChangeStatus", checked);
		setStatus(checked); // Update the state
	};

	const handleCancelEdit = () => {
		setIsEdit(todoDefault);
		setTitle("");
		setDescription("");
		setStatus(false);
	};

	/*const handleAddTasks = (e) => {
        e.preventDefault();
        let title = e.target.title.value
        let desc = e.target.desc.value

        setStateManagement(prevStateManagement  => {
            return ({
                ...prevStateManagement, // to preserve all the states
                tasks: [ // targeting the todos state
                    ...prevStateManagement.tasks, // get the current todo
                    {title, desc} // add new item
                ]
            })
        })
    }*/

	const handleDateSelect = (date: any) => {
		setSelectedDate(date); // Update the state when a date is selected
	};

	const handleLogout = async () => {
		const auth = getAuth(); // Get the Auth instance
		try {
			await signOut(auth); // Sign out the user
			console.log("User signed out successfully");
			router.push("/signin"); // Redirect to the login page or home after logout
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	if (!isLogged) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="border-gray-300 h-12 w-12 animate-spin rounded-full border-8 border-t-blue-600"></div>
			</div>
		);
	} else {
		return (
			<div className="flex">
				<div className="w-full m-2">
					<div>
						<h1 className="text-3xl uppercase font-extrabold text-gray-800 flex justify-between items-center gap-2">
							<span>POCHENG- </span>
							<button
								type="submit"
								className="flex items-center px-2 font-medium tracking-wide  capitalize bg-red-800 rounded-md hover:bg-red-700  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out text-white"
								onClick={handleLogout}
							>
								<div className="w-6 h-6">
									<LogoutIcon />
								</div>
							</button>
						</h1>
						<form onSubmit={(e) => handleSaveTodos(e)} method="post">
							<div className="mt-2  rounded-lg shadow">
								<div className="flex">
									<div className="flex items-center py-4 pl-3 overflow-hidden">
										<div className="w-6 h-6 ">
											<ClipboardListIcon className="" />
										</div>
										<h1 className="inline text-2xl font-semibold leading-none ">
											{isEdit?.id ? "Update" : "Add"}
										</h1>
									</div>
								</div>
								<div className="px-3 pb-3">
									<div className="text-gray-900 hidden">
										{isEdit?.id && <div>Edit ID: {isEdit?.id}</div>}
									</div>
									<div className="flex flex-col gap-2">
										{/*<input type="text" name="name" value={name || ''} onChange={(e) => setName(e.target.value)} placeholder="Name" className=" text-black placeholder-gray-600 hover:placeholder-gray-600  w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-gray-200 focus:bg-white dark:focus:bg-gray-200 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-gray-400" />*/}
										<input
											type="text"
											name="title"
											value={title || ""}
											onChange={(e) => setTitle(e.target.value)}
											placeholder="Title"
											className={`text-black placeholder-gray-600 hover:placeholder-gray-600  w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-gray-200 focus:bg-white dark:focus:bg-gray-200 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-gray-400 ${
												isTitleEmpty ? "border-2 border-red-600" : ""
											} `}
										/>
										{isTitleEmpty && (
											<div className="text-red-600 font-semibold">
												Title is required.
											</div>
										)}
									</div>

									<textarea
										name="desc"
										value={description || ""}
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
											setDescription(e.target.value)
										}
										placeholder="Description"
										className="text-black placeholder-gray-600 hover:placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-gray-200 focus:bg-white dark:focus:bg-gray-200 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-gray-400"
									/>

									<div className="my-1 text-l flex flex-col justify-start items-start gap-2">
										<div className="group relative cursor-pointer">
											<div className="flex justify-center items-center gap-2">
												<p className="">Event Date:</p>
												{selectedDate && (
													<p className="font-bold">
														{format(selectedDate, "MMMM dd, yyyy")}
													</p>
												)}
											</div>

											<div className="hidden group-hover:block absolute bg-white z-10 ">
												<Calendar
													mode="single"
													selected={selectedDate}
													onSelect={handleDateSelect}
													className="rounded-md border w-fit mb-2"
												/>
											</div>
										</div>

										<label
											htmlFor="status"
											className="flex items-center cursor-pointer"
										>
											<div className=" mr-2">Status</div>
											<div className="relative">
												<Switch
													checked={status}
													onCheckedChange={onChangeStatus}
												/>
											</div>
										</label>
									</div>
								</div>
								<div className="px-5 "> </div>
								<hr className="mt-4" />
								<div className="flex p-3">
									<div className="flex space-x-2">
										{isEdit?.id && (
											<button
												type="button"
												onClick={() => handleCancelEdit()}
												className="flex items-center px-5 py-2.5 font-medium tracking-wide capitalize   bg-gray-200 rounded-md hover:bg-gray-600 hover:text-white  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out"
											>
												<div className="w-6 h-6">
													<BackspaceIcon />
												</div>
												<span className="pl-2 mx-1">Cancel</span>
											</button>
										)}
										<button
											type="submit"
											className="flex items-center px-5 py-2.5 font-medium tracking-wide  capitalize bg-blue-800 rounded-md hover:bg-blue-700  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out text-white"
										>
											<div className="w-6 h-6">
												<SaveIcon />
											</div>
											<span className="pl-2 mx-1">Save</span>
										</button>
									</div>
								</div>
							</div>
						</form>

						<div className="mt-5  rounded-lg shadow text-gray-900">
							<div className="flex">
								<div className="flex items-center py-5 pl-3 overflow-hidden">
									<div className="w-6 h-6 ">
										<CollectionIcon className=" " />
									</div>
									<h1 className="inline text-2xl font-semibold leading-none ">
										Agenda
									</h1>
								</div>
							</div>
							<div className=" p-3 pt-0 overflow-x-auto	">
								{_.size(todoLists) != 0 ? (
									<table className="w-full table-auto border-collapse">
										<thead className="text-left">
											<tr>
												<th className="text-lg text-gray-900 px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[400px]">
													Title
												</th>
												<th className="text-lg text-gray-900 px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-full">
													Description
												</th>
												<th className="hidden text-lg text-gray-900 px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
													Status
												</th>
												<th className="hidden text-lg text-gray-900 px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
													Date
												</th>
												<th className="text-lg text-gray-900 px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-left w-fit">
													Actions
												</th>
											</tr>
										</thead>
										<tbody>{todoLists}</tbody>
									</table>
								) : (
									<p>You dont have agenda</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StateManagement;
