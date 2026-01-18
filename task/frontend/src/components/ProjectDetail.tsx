import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { projectsAPI } from '../services/api';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'info';
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

  if (!project) {
    return <Typography>Project not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">{project.name}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {project.description || 'No description'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip label={`Status: ${project.status}`} />
          <Chip label={`Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}`} />
          <Chip label={`Created: ${new Date(project.createdAt).toLocaleDateString()}`} />
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>Tasks</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {project.tasks?.map((task: any) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.status} 
                    size="small"
                    color={
                      task.status === 'completed' ? 'success' :
                      task.status === 'in-progress' ? 'primary' :
                      task.status === 'blocked' ? 'error' : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`Priority ${task.priority}`}
                    color={getPriorityColor(task.priority) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(task.deadline).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectDetail;