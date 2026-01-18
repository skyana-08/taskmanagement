import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import ProjectDialog from './ProjectDialog';
import TaskDialog from './TaskDialog';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  deadline: string;
  tasks: any[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: number;
  deadline: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll(),
      ]);
      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Task Management Dashboard</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProjectDialog(true)}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            New Project
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskDialog(true)}
            disabled={loading || projects.length === 0}
            title={projects.length === 0 ? 'Create a project first' : ''}
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Projects Grid */}
      <Typography variant="h5" sx={{ mb: 2 }}>Projects</Typography>
      {projects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No projects yet. Create your first project!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          {projects.map((project) => (
            <Box key={project.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  height: '100%',
                  '&:hover': { boxShadow: 6 }
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{project.name}</Typography>
                    <Chip 
                      label={project.status} 
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                    {project.description || 'No description'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasks: {project.tasks?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Tasks Table Preview */}
      <Typography variant="h5" sx={{ mb: 2 }}>Recent Tasks</Typography>
      {tasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No tasks yet. Create your first task!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {tasks.slice(0, 6).map((task) => (
            <Box key={task.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                    {task.description || 'No description'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">
                      Priority: {task.priority}
                    </Typography>
                    <Typography variant="caption">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Dialogs */}
      <ProjectDialog
        open={openProjectDialog}
        onClose={() => setOpenProjectDialog(false)}
        onSuccess={() => {
          setOpenProjectDialog(false);
          fetchData();
        }}
      />
      
      <TaskDialog
        open={openTaskDialog}
        onClose={() => setOpenTaskDialog(false)}
        onSuccess={() => {
          setOpenTaskDialog(false);
          fetchData();
        }}
        projects={projects}
      />
    </Box>
  );
};

export default Dashboard;