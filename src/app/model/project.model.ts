// export interface TaskEntry {
//   id: string;
//   name: string;
//   description: string;
//   billable: boolean;
//   hours: { [key: string]: number }; // e.g., { 'Mon': 8, 'Tue': 0, ... }
// }

// export interface Project {
//   id: string;
//   name: string;
//   tasks: TaskEntry[];
// }




// export interface Task {
//   id: number;
//   name: string;
//   description: string;
//   billable: boolean;
//   hours: { [day: string]: string }; // <<<<< CRUCIAL!
// }

export interface Project {
  id: number;
  name: string;
  tasks: Task[];
}
// In your project.model.ts or create a new task.model.ts
export interface Task {
  id: number;
  name: string;
  description: string;
  billable: boolean;
  status?: string;
  category?: string;
  hours: { [day: string]: string };  // This allows string indexing
}