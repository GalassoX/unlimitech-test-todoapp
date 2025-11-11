import TaskCard from "./TaskCard";
import { EditableTask } from "./EditableTask";
import { useTasks } from "@/hooks/useTasks";
import TaskSkeleton from "./TaskSkeleton";
import { observer } from "mobx-react-lite";

const TaskList = observer(() => {
  const { tasks, isGettingTasks } = useTasks();

  return (
    <div className="grid grid-cols-3 gap-3">
      {isGettingTasks && <TaskSkeleton />}
      {tasks?.map((task) => (
        <EditableTask task={task} key={task._id}>
          <TaskCard task={task} />
        </EditableTask>
      ))}
    </div>
  )
})

export default TaskList;