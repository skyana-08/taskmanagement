import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Fade,
  Tooltip,
  LinearProgress,
  alpha,
} from '@mui/material';
import { 
  Add as AddIcon, 
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return '#ff4444'; // High
      case 2: return '#ffbb33'; // Medium
      case 3: return '#00C851'; // Low
      default: return '#666666';
    }
  };

  const getProgressValue = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60}
            thickness={4}
            sx={{
              color: '#1976d2',
              mb: 3,
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: 1,
            }}
          >
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          color: '#ffffff',
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {/* Header */}
          <Box
            sx={{
              mb: 6,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 3,
              p: 3,
              borderRadius: 3,
              background: 'rgba(25, 25, 25, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #4caf50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 1,
                }}
              >
                Task Management Dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px' }}
              >
                Manage your projects and tasks efficiently in one place
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Tooltip title="Create new project">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenProjectDialog(true)}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  New Project
                </Button>
              </Tooltip>

              <Tooltip title={projects.length === 0 ? 'Create a project first' : 'Create new task'}>
                <span>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenTaskDialog(true)}
                    disabled={loading || projects.length === 0}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderColor: projects.length === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                      color: projects.length === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transform: projects.length > 0 ? 'translateY(-2px)' : 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    New Task
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>

          {/* Stats Overview */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
              gap: 3,
              mb: 6,
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(25, 25, 25, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(25, 118, 210, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Total Projects
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
                  {projects.length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Active projects
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(25, 25, 25, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(76, 175, 80, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Total Tasks
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50', mb: 2 }}>
                  {tasks.length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Across all projects
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(25, 25, 25, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(255, 152, 0, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Completed Tasks
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff9800', mb: 2 }}>
                  {tasks.filter(t => t.status === 'completed').length}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 || 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #ff9800, #ff5722)',
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(25, 25, 25, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(156, 39, 176, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  In Progress
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#9c27b0', mb: 2 }}>
                  {tasks.filter(t => t.status === 'in-progress').length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Currently working on
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Projects Section */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    background: 'linear-gradient(180deg, #1976d2, #2196f3)',
                    borderRadius: 1,
                  }}
                />
                Projects
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {projects.length} total
              </Typography>
            </Box>

            {projects.length === 0 ? (
              <Card
                sx={{
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  py: 6,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.1)' }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'rgba(33, 26, 26, 0.7)', mb: 1 }}>
                  No projects yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3 }}>
                  Create your first project to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenProjectDialog(true)}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                  }}
                >
                  Create First Project
                </Button>
              </Card>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 3,
                }}
              >
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{
                      borderRadius: 3,
                      background: 'rgba(25, 25, 25, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      height: '100%',
                      '&:hover': {
                        borderColor: 'rgba(25, 118, 210, 0.5)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#ffffff',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {project.name}
                        </Typography>
                        <Chip
                          label={project.status.replace('-', ' ')}
                          color={getStatusColor(project.status) as any}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {project.description || 'No description provided'}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Progress
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                            {getProgressValue(project.tasks || [])}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getProgressValue(project.tasks || [])}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #1976d2, #4caf50)',
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {project.tasks?.length || 0} tasks
                          </Typography>
                          <ArrowForwardIcon sx={{ fontSize: 16, color: 'rgba(25, 118, 210, 0.7)' }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

          {/* Tasks Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    background: 'linear-gradient(180deg, #4caf50, #8bc34a)',
                    borderRadius: 1,
                  }}
                />
                Recent Tasks
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/tasks')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  },
                }}
              >
                View All
              </Button>
            </Box>

            {tasks.length === 0 ? (
              <Card
                sx={{
                  borderRadius: 3,
                  background: 'rgba(25, 25, 25, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  py: 6,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.1)' }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  No tasks yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3 }}>
                  {projects.length === 0 ? 'Create a project first' : 'Add your first task'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenTaskDialog(true)}
                  disabled={projects.length === 0}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                  }}
                >
                  Create First Task
                </Button>
              </Card>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 3,
                }}
              >
                {tasks.slice(0, 6).map((task) => (
                  <Card
                    key={task.id}
                    sx={{
                      borderRadius: 3,
                      background: 'rgba(25, 25, 25, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      height: '100%',
                      '&:hover': {
                        borderColor: 'rgba(76, 175, 80, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: '#ffffff',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.status.replace('-', ' ')}
                          color={getStatusColor(task.status) as any}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            textTransform: 'capitalize',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {task.description || 'No description provided'}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: getPriorityColor(task.priority),
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Priority {task.priority}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {new Date(task.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: '#4caf50',
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            },
                          }}
                        >
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>

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
    </Fade>
  );
};

export default Dashboard;