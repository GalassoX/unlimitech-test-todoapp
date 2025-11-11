import { getTasks } from "@/services/tasks";
import { useEffect, useState } from "react";
import { taskStore } from "@/stores/taskStore";

export function useTasks() {
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