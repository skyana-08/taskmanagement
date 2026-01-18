import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  alpha,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getOne(parseInt(id!));
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#2196f3';
      case 'blocked': return '#f44336';
      case 'pending': return '#ff9800';
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
            Loading Project...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          color: '#ffffff',
        }}
      >
        <Typography variant="h5">Project not found</Typography>
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
          {/* Header with Back Button */}
          <Box sx={{ mb: 4 }}>
            <Tooltip title="Go back to dashboard">
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  mb: 2,
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#1976d2',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 3,
                mb: 3,
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
                  {project.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '800px',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                  }}
                >
                  {project.description || 'No description available'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip
                  icon={<FlagIcon />}
                  label={project.status.replace('-', ' ')}
                  sx={{
                    backgroundColor: alpha(getStatusColor(project.status), 0.2),
                    color: getStatusColor(project.status),
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    border: `1px solid ${alpha(getStatusColor(project.status), 0.3)}`,
                  }}
                />
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Created: ${new Date(project.createdAt).toLocaleDateString()}`}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </Box>
            </Box>

            {/* Project Stats */}
            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(25, 25, 25, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mb: 4,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Project Progress
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Task Completion
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                          {getProgressValue(project.tasks || [])}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressValue(project.tasks || [])}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #1976d2, #4caf50)',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {project.tasks?.filter((t: any) => t.status === 'completed').length || 0} of {project.tasks?.length || 0} tasks completed
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Task Distribution
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          In Progress
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>
                          {project.tasks?.filter((t: any) => t.status === 'in-progress').length || 0}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Pending
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                          {project.tasks?.filter((t: any) => t.status === 'pending').length || 0}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Blocked
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 700 }}>
                          {project.tasks?.filter((t: any) => t.status === 'blocked').length || 0}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Total Tasks
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>
                          {project.tasks?.length || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Tasks Table */}
          <Card
            sx={{
              borderRadius: 3,
              background: 'rgba(25, 25, 25, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    background: 'linear-gradient(180deg, #4caf50, #8bc34a)',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                  Tasks
                </Typography>
                <Chip
                  icon={<AssignmentIcon />}
                  label={`${project.tasks?.length || 0} tasks`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                  }}
                />
              </Box>

              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        Priority
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        Deadline
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {project.tasks?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <AssignmentIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            No tasks yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Add tasks to this project to get started
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      project.tasks?.map((task: any) => (
                        <TableRow 
                          key={task.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <TableCell sx={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Typography sx={{ fontWeight: 500 }}>{task.title}</Typography>
                            {task.description && (
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mt: 0.5 }}>
                                {task.description.length > 60 ? task.description.substring(0, 60) + '...' : task.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Chip 
                              label={task.status.replace('-', ' ')}
                              size="small"
                              sx={{
                                backgroundColor: alpha(getStatusColor(task.status), 0.2),
                                color: getStatusColor(task.status),
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                border: `1px solid ${alpha(getStatusColor(task.status), 0.3)}`,
                                minWidth: 100,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: getPriorityColor(task.priority),
                                }}
                              />
                              <Chip 
                                label={`Priority ${task.priority}`}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                  color: getPriorityColor(task.priority),
                                  fontWeight: 500,
                                  border: `1px solid ${alpha(getPriorityColor(task.priority), 0.2)}`,
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarTodayIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                              {new Date(task.deadline).toLocaleDateString()}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit task">
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                      color: '#1976d2',
                                    },
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete task">
                                <IconButton
                                  size="small"
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                      color: '#f44336',
                                    },
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectDetail;