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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
            
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                required
                name="projectId"
                value={formData.projectId}
                onChange={handleSelectChange}
                label="Project"
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
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
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={1}>High (1)</MenuItem>
              <MenuItem value={2}>Medium (2)</MenuItem>
              <MenuItem value={3}>Normal (3)</MenuItem>
              <MenuItem value={4}>Low (4)</MenuItem>
              <MenuItem value={5}>Very Low (5)</MenuItem>
            </TextField>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={formData.deadline}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
            
            {error && (
              <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>
                {error}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDialog;