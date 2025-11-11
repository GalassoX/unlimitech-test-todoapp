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
import { useStores } from "@/hooks/useStores";
import { useEffect } from "react";
import { EditableTask } from "./EditableTask";

const Tasks = observer(() => {
  const { user, isGettingUser } = useUser();
  const { taskStore } = useStores();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const successLogout = await logout();
    if (successLogout) {
      navigate(ROUTES.LOGIN);
      return;
    }

    toast.error('Sucedió un error, intentalo más tarde.');
  }

  useEffect(() => {
    if (!isGettingUser && !user) {
      navigate('/login');
    }
  }, [isGettingUser]);

  return (
    <div className="flex justify-center h-full">
      <div className="w-1/2 h-full max-w-4xl mx-auto pt-4 md:p-8">
        <div className="flex justify-between mb-12">
          {!isGettingUser 
            ? <h1 className="text-3xl font-bold">Bienvenido, {user?.username}</h1>
            : <Skeleton className="h-10 w-[400px]" />
          }
          <Button variant='outline' size='sm' onClick={handleLogout}>
            <LogOut />
            Salir
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Tareas
            <span className="text-sm font-light text-neutral-400"> ({taskStore.taskPendingCount} tareas sin empezar)</span>
          </h1>
          <EditableTask>
            <Button>
              <PlusIcon />
              Crear tarea
            </Button>
          </EditableTask>
        </div>
        <TaskList />
      </div>
    </div>
  )
})

export default Tasks;