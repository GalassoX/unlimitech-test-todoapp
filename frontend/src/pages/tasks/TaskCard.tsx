import { formatDistanceStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TaskStatusBadge from "./TaskStatusBadge";
import { useMemo } from 'react';

type ComponentProps = { task: Task; onClick: () => void; };

export default function TaskCard({ task, onClick }: ComponentProps) {
  const createdTime = useMemo(
    () => formatDistanceStrict(new Date(task.createdAt), new Date(), { locale: es, addSuffix: true }),
    [task.createdAt]
  );

  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-left">{task.title}</CardTitle>
        <CardDescription className='text-left text-xs'>Creado {createdTime}</CardDescription>
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