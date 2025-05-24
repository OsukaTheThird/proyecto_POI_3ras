import { useState, useEffect } from "react";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Navbar from "./navbar";

const List = () => {
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [points, setPoints] = useState(0);

  // Cargar tareas y puntos al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedPoints = localStorage.getItem('points');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPoints) setPoints(parseInt(savedPoints));
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', points.toString());
  }, [tasks, points]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    const wasCompleted = updatedTasks[index].completed;
    updatedTasks[index].completed = !wasCompleted;
    setTasks(updatedTasks);
    
    // Solo sumar puntos si se marca como completada (no al desmarcar)
    if (!wasCompleted) {
      setPoints(prev => prev + 5);
    }
  };

  const deleteTask = (index: number) => {
    // Restar puntos si la tarea estaba completada
    if (tasks[index].completed) {
      setPoints(prev => prev - 5);
    }
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen">
      <Navbar points={points} />
      
      <div className="max-w-md mx-auto mt-10 p-6 bg-green-200 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Agenda de Tareas</h1>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full">
            Puntos: {points}
          </div>
        </div>

        <div className="flex">
          <Input
            type="text"
            placeholder="Nueva tarea..."
            className="w-full p-2 border rounded-l"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
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