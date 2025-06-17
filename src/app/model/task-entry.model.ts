// export interface TaskEntry {
//   id: number;
//   name: string;
//   description: string;
//   billable: boolean;
//   hours: { [day: string]: number }; // e.g., { Mon: 8, Tue: 5, ... }
// }

export interface Task {
  name: string;
  description: string;
  billable: boolean;
  hours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
}

export interface Project {
  id: string;
  name: string;
  billable: boolean;
  tasks: Task[];
}
