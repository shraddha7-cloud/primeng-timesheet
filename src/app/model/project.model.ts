import { TaskEntry } from './task-entry.model';

export interface Project {
  name: string;
  tasks: TaskEntry[];
}
