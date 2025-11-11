import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { LogOut, PlusIcon } from "lucide-react";
import TaskList from "./TaskList";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { EditableTask } from "./EditableTask";
import { createTask, getTasks } from "@/services/tasks";
import { taskStore } from "@/stores/taskStore";

const Tasks = observer(() => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user, isGettingUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isGettingUser && !user) {
      navigate('/login');
    }
  }, [isGettingUser]);

  const handleLogout = async () => {
    const successLogout = await logout();
    if (successLogout) {
      navigate(ROUTES.LOGIN);
      return;
    }

    toast.error('Sucedió un error, intentalo más tarde.');
  }
  
  const updateTaskState = async () => {
    const tasks = await getTasks();
    if (!tasks.length) {
      toast.error('Error obteniendo las tareas, intentalo más tarde.');
      return;
    }
    
    taskStore.setTasks(tasks);
  }

  const handleSubmitCreateTask = async ({ title, status, description }: OnSubmitTask) => {
    const newTask = await createTask({
      title,
      status,
      description
    });
  
    if (!newTask) {
      toast.error('Ocurrió un error creando la tarea, intentalo más tarde.');
      return;
    }

    toast.info('Tarea creada correctamente.');

    setIsCreateDialogOpen(false);
    await updateTaskState();
  }

  return (
    <div className="flex justify-center h-full">
      <div className="w-9/10 md:w-2/3 xl:w-1/2 h-full max-w-4xl mx-auto pt-4 md:p-8">
        <div className="flex justify-between mb-12">
          {user 
            ? <h1 className="text-3xl font-bold">Bienvenido, {user?.username}</h1>
            : <Skeleton className="h-10 w-[400px]" />
          }
          <Button variant='outline' size='sm' onClick={handleLogout}>
            <LogOut />
            Salir
          </Button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-2xl font-bold">
            Tareas
            <span className="text-sm font-light text-neutral-400"> ({taskStore.taskPendingCount} tareas pendientes)</span>
          </h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusIcon />
            Crear tarea
          </Button>
        </div>
        <EditableTask open={isCreateDialogOpen} setOpen={setIsCreateDialogOpen} onSubmit={handleSubmitCreateTask} />
        <TaskList />
      </div>
    </div>
  )
})

export default Tasks;