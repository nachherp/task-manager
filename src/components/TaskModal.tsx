// TaskModal.tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Form, Button } from 'react-bootstrap';
import { Task, ActiveTab } from '../types';

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id'> & { id?: number }) => void;
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ show, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState<Omit<Task, 'id'> & { id?: number }>({
    id: undefined,
    name: '',
    description: '',
    completed: false
  });

  useEffect(() => {
    if (task) setFormData(task);
    else setFormData({ id: undefined, name: '', description: '', completed: false });
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      name: formData.name.trim()
    });
  };

  return createPortal(
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Editar Tarea' : 'Nueva Tarea'}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la tarea</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit">
            {task ? 'Guardar Cambios' : 'Crear Tarea'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>,
    document.body
  );
};

export default TaskModal;