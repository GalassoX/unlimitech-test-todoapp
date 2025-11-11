import TaskCard from "./TaskCard";
import { EditableTask } from "./EditableTask";
import { useTasks } from "@/hooks/useTasks";
import TaskSkeleton from "./TaskSkeleton";
import { observer } from "mobx-react-lite";
import { getTasks, updateTask } from "@/services/tasks";
import { toast } from "sonner";
import { useState } from "react";
import { taskStore } from "@/stores/taskStore";

const TaskList = observer(() => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { tasks, isGettingTasks } = useTasks();
  
  const updateTaskState = async () => {
    const tasks = await getTasks();
    if (!tasks.length) {
      toast.error('Error obteniendo las tareas, intentalo más tarde.');
      return;
    }
    
    taskStore.setTasks(tasks);
  }

  const handleSubmitEditTask = async ({ task, title, status, description }: OnSubmitTask) => {
    if (!task) return;

    const taskEdited = await updateTask(task._id, {
      title,
      status,
      description,
    });

    if (!taskEdited) {
      toast.error('Ocurrió un error actualizando la tarea, intentalo más tarde.');
      return;
    }

    toast.info('Tarea actualizada correctamente.');

    setIsEditDialogOpen(false);
    await updateTaskState();
  }

  const openEditTask = (taskSelected: Task) => {
    taskStore.setCurrentTask(taskSelected);
    setIsEditDialogOpen(true);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {isGettingTasks && <TaskSkeleton />}
      {tasks?.map((task) => (
        <TaskCard key={task._id} task={task} onClick={() => openEditTask(task)} />
      ))}
      <EditableTask open={isEditDialogOpen} 
        setOpen={setIsEditDialogOpen}
        task={taskStore.currentTask!}
        onSubmit={handleSubmitEditTask} />
    </div>
  )
})

export default TaskList;