import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TaskStatusBadge from "./TaskStatusBadge";

type ComponentProps = { task: Task; };

export default function TaskCard({ task }: ComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">{task.title}</CardTitle>
        <CardDescription className='text-left text-xs'>Creado {formatDistance(new Date(task.createdAt), new Date(), { locale: es, addSuffix: true })}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-left">{task.description}</p>
      </CardContent>
      <CardFooter>
        <TaskStatusBadge status={task.status} />
      </CardFooter>
    </Card>
  )
}