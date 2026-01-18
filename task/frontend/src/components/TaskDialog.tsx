import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Typography,
  InputAdornment,
  Fade,
  CircularProgress,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Title as TitleIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  Flag as FlagIcon,
  PriorityHigh as PriorityHighIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { tasksAPI } from '../services/api';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projects: any[];
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, onSuccess, projects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 1,
    deadline: null as Date | null,
    projectId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projects.length > 0 && !formData.projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: projects[0].id.toString(),
      }));
    }
  }, [projects, formData.projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      deadline: date,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      setError('Please select a project');
      return;
    }
    
    if (!formData.deadline) {
      setError('Please select a deadline');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await tasksAPI.create({
        ...formData,
        projectId: parseInt(formData.projectId),
        deadline: formData.deadline.toISOString().split('T')[0],
      });
      onSuccess();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 1,
      deadline: null,
      projectId: projects.length > 0 ? projects[0].id.toString() : '',
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return '#ff4444';
      case 2: return '#ffbb33';
      case 3: return '#00C851';
      case 4: return '#33b5e5';
      case 5: return '#aa66cc';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'blocked': return '#f44336';
      default: return '#666666';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(25, 25, 25, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Fade in={open} timeout={300}>
        <Box>
          <Box
            sx={{
              height: 4,
              background: 'linear-gradient(90deg, #4caf50 0%, #2196f3 100%)',
            }}
          />
          
          <DialogTitle sx={{ pb: 1, pt: 3 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
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
              Create New Task
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5, ml: 5.5 }}>
              Add details for your new task
            </Typography>
          </DialogTitle>
          
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ px: 3, pt: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  required
                  label="Task Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#ffffff',
                    },
                  }}
                />
                
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: -1.5 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#ffffff',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                />
                
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Project</InputLabel>
                  <Select
                    required
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleSelectChange}
                    label="Project"
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '& .MuiSelect-select': {
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <FolderIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    }
                  >
                    {projects.map((project) => (
                      <MenuItem 
                        key={project.id} 
                        value={project.id}
                        sx={{ 
                          backgroundColor: 'rgba(25, 25, 25, 0.9)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                      >
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlagIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#ffffff',
                    },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  <MenuItem value="pending" sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor('pending') }} />
                      Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="in-progress" sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor('in-progress') }} />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed" sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor('completed') }} />
                      Completed
                    </Box>
                  </MenuItem>
                  <MenuItem value="blocked" sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor('blocked') }} />
                      Blocked
                    </Box>
                  </MenuItem>
                </TextField>
                
                <TextField
                  select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriorityHighIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#ffffff',
                    },
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  <MenuItem value={1} sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(1) }} />
                      High (1)
                    </Box>
                  </MenuItem>
                  <MenuItem value={2} sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(2) }} />
                      Medium (2)
                    </Box>
                  </MenuItem>
                  <MenuItem value={3} sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(3) }} />
                      Normal (3)
                    </Box>
                  </MenuItem>
                  <MenuItem value={4} sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(4) }} />
                      Low (4)
                    </Box>
                  </MenuItem>
                  <MenuItem value={5} sx={{ 
                    backgroundColor: 'rgba(25, 25, 25, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(5) }} />
                      Very Low (5)
                    </Box>
                  </MenuItem>
                </TextField>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Deadline"
                    value={formData.deadline}
                    onChange={handleDateChange}
                    disabled={loading}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: '#ffffff',
                          },
                        },
                      },
                      popper: {
                        sx: {
                          '& .MuiPaper-root': {
                            backgroundColor: 'rgba(25, 25, 25, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                          },
                          '& .MuiPickersDay-root': {
                            color: '#ffffff',
                            '&.Mui-selected': {
                              backgroundColor: '#4caf50',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                
                {error && (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                      color: '#ff5252',
                      '& .MuiAlert-icon': {
                        color: '#ff5252',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
              <Button
                onClick={handleClose}
                disabled={loading}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #43a047, #4caf50)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: 120,
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Create Task'
                )}
              </Button>
            </DialogActions>
          </form>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default TaskDialog;