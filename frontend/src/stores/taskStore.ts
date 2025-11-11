import { makeAutoObservable, observable } from "mobx";

class TaskStore {
  private _tasks: Task[] = observable([]);
  private _currentTask: Task | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get tasks(): Task[] {
    return this._tasks;
  }
  
  public setTasks(v: Task[]) {
    this._tasks.splice(0, this._tasks.length, ...v);
  }

  public get taskPendingCount(): number {
    return this._tasks.filter(task => !task.status).length;
  }

  public setCurrentTask(task: Task | null): void {
    this._currentTask = task;
  }

  public get currentTask(): Task | null {
    return this._currentTask;
  }
  
}

export const taskStore = new TaskStore();