// TaskList.tsx
import { memo } from 'react';
import { ListGroup } from 'react-bootstrap';
import TaskItem from './TaskItem';
import { Task, ActiveTab } from '../types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = memo(({ tasks, onEdit, onDelete, onStatusChange }) => {
  if (tasks.length === 0) {
    return <div className="text-center my-4">No hay tareas disponibles</div>;
  }

  return (
    <ListGroup>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </ListGroup>
  );
});

export default TaskList;