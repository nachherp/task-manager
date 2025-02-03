import { useState, useEffect, useCallback } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskModal from './components/TaskModal';
import TaskList from './components/TaskList';
import { Task, ActiveTab } from './types';

const STORAGE_KEY = 'task-manager-v1';

const isValidTask = (task: any): task is Task => {
  return (
    typeof task?.id === 'number' &&
    typeof task?.name === 'string' &&
    typeof task?.description === 'string' &&
    typeof task?.completed === 'boolean'
  );
};

const loadTasks = (): Task[] => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    
    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) return [];
    
    return parsedData.filter(isValidTask);
  } catch (error) {
    console.error('Error loading tasks:', error);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  try {
    const data = JSON.stringify(tasks);
    if (data.length > 5000000) {
      throw new Error('Límite de almacenamiento excedido');
    }
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [error, setError] = useState('');

  // Carga inicial
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Persistencia
  useEffect(() => {
    const timer = setTimeout(() => saveTasks(tasks), 500);
    return () => clearTimeout(timer);
  }, [tasks]);

  const handleSubmit = (taskData: Omit<Task, 'id'> & { id?: number }) => {
    if (!taskData.name.trim()) {
      setError('El nombre de la tarea es requerido');
      return;
    }
    
    setError('');
    const updatedTasks = taskData.id
      ? tasks.map(t => t.id === taskData.id ? { ...taskData as Task } : t)
      : [...tasks, { ...taskData, id: Date.now() } as Task];

    setTasks(updatedTasks);
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = useCallback((id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleStatusChange = useCallback((id: number) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditTask(task);
    setShowModal(true);
  }, []);

  const filteredTasks = tasks.filter(task => {
    switch (activeTab) {
      case 'completed': return task.completed;
      case 'pending': return !task.completed;
      default: return true;
    }
  });

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Administrador de Tareas</h1>

      <div className="d-flex justify-content-between mb-4">
        <div className="btn-group">
          <Button
            variant={activeTab === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('all')}
          >
            Todas
          </Button>
          <Button
            variant={activeTab === 'pending' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('pending')}
          >
            Pendientes
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('completed')}
          >
            Completadas
          </Button>
        </div>

        <Button
          variant="success"
          onClick={() => {
            setEditTask(null);
            setShowModal(true);
          }}
        >
          Nueva Tarea
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <TaskList
        tasks={filteredTasks}
        onEdit={handleEdit}  // Usamos la función corregida
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <TaskModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask(null);
        }}
        onSubmit={handleSubmit}
        task={editTask}
      />
    </Container>
  );
}

export default App;