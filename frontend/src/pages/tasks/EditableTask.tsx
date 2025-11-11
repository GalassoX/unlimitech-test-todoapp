import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useRef, useState, type FormEvent } from "react";

type ComponentProps = { 
  task?: Task;
  onSubmit: (data: OnSubmitTask) => void;
  open: boolean;
  setOpen: (state: boolean) => void;
};

export function EditableTask({ task, onSubmit, open, setOpen }: ComponentProps) {

  const [isTaskChanged, setIsTaskChanged] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const taskFormRef = useRef<HTMLFormElement>(null);

  const checkIsTaskChangedFn = useCallback(() => {
    const form = taskFormRef.current;
    if (!form || !task) return;

    const formData = new FormData(form);

    const title = formData.get('title')?.toString();
    setTitleError(!title);

    setIsTaskChanged(task.title !== formData.get('title')?.toString()
      || String(task.status) !== formData.get('status')?.toString()
      || task.description !== formData.get('description')?.toString());
  }, []);

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const title = formData.get('title')?.toString();
    const status = formData.get('status')?.toString() === 'true';
    const description = formData.get('description')?.toString();

    if (!title) return;

    onSubmit({ task, title, description, status });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent >
        <DialogTitle>Tarea</DialogTitle>
        <DialogDescription></DialogDescription>
        <form onSubmit={onSubmitForm} ref={taskFormRef} className="grid gap-4">
          <div className="flex gap-3">
            <div className="grid gap-3 w-full">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" defaultValue={task?.title} onChange={checkIsTaskChangedFn} className={`${titleError ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}`} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Estado</Label>
              <Select defaultValue={String(task?.status)} onValueChange={checkIsTaskChangedFn} name="status">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent id="status">
                  <SelectGroup>
                    <SelectLabel>Estados</SelectLabel>
                    <SelectItem value="true">Listo</SelectItem>
                    <SelectItem value="false">Sin empezar</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {titleError && <span className="text-red-500 text-xs">El título es requerido!</span>}
          <div className="grid gap-3">
            <Label htmlFor="username-1">Descripción</Label>
            <Textarea name="description" defaultValue={task?.description} onChange={checkIsTaskChangedFn} />
          </div>
          <Button type="submit" disabled={!isTaskChanged && !!task && titleError}>Guardar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}