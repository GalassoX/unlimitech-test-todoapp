import { getTasks } from "@/services/tasks";
import { useEffect, useState } from "react";
import { useStores } from "./useStores";

export function useTasks() {
  const { taskStore } = useStores();
  const [isGettingTasks, setIsGettingTasks] = useState<boolean>(true);

  useEffect(() => {
    if (!taskStore.tasks.length) {
      getTasks()
        .then(tasks => taskStore.setTasks(tasks))
        .finally(() => setIsGettingTasks(false));
    }
  }, [])

  return { tasks: taskStore.tasks, isGettingTasks };
}