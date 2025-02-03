import { memo, useRef } from 'react';
import { ListGroupItem, Button, Form } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { Task } from '../types';
import '../styles/styles.css';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = memo(({ task, onEdit, onDelete, onStatusChange }) => {
  const nodeRef = useRef<HTMLLIElement>(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={300}
      classNames="task-item"
    >
      <ListGroupItem ref={nodeRef} className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center flex-grow-1">
          <Form.Check
            type="checkbox"
            checked={task.completed}
            onChange={() => onStatusChange(task.id)}
            className="me-3"
          />
          
          <div className="flex-grow-1">
            <h5 className={task.completed ? 'text-muted text-decoration-line-through' : ''}>
              {task.name}
              {task.completed && (
                <span className="badge bg-success ms-2">Completada</span>
              )}
            </h5>
            <p className="mb-0 text-muted">{task.description}</p>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => onEdit(task)}>
            Editar
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(task.id)}>
            Eliminar
          </Button>
        </div>
      </ListGroupItem>
    </CSSTransition>
  );
});

export default TaskItem;