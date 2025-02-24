import { useState } from "react";
import { Button } from '../components/ui/button';
import {Input} from '../components/ui/input';
import Navbar from "./navbar"


const List = () => {
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen">
    <Navbar />

    <div className="max-w-md mx-auto mt-10 p-6 bg-green-200 rounded-xl shadow-lg">
      
      <h1 className="text-2xl font-bold mb-4 text-center">Agenda de Tareas</h1>

      <div className="flex ">
        <Input
          type="text"
          placeholder="Nueva tarea..."
          className="w-full p-2 border rounded-l"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          onClick={addTask}
        >
          Agregar
        </Button>
      </div>

      <ul className="mt-4 space-y-2 bg-white rounded-lg shadow">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-2 border rounded ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <Input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(index)}
              />
              {task.text}
            </label>
            <Button
              className="text-red-500 hover:text-red-700"
              onClick={() => deleteTask(index)}
            >
              🗑
            </Button>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default List;
