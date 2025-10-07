import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Security,
  Language,
  AttachMoney
} from '@mui/icons-material';
import type { Provider } from '../types/Provider';

interface ProviderTableProps {
  providers: Provider[];
  onView: (provider: Provider) => void;
  onEdit: (provider: Provider) => void;
  onDelete: (id: number) => void;
  onScreening: (provider: Provider) => void;
  loading?: boolean;
}

const ProviderTable: React.FC<ProviderTableProps> = ({
  providers,
  onView,
  onEdit,
  onDelete,
  onScreening,
  loading = false
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    provider: Provider | null;
  }>({ open: false, provider: null });

  const handleDeleteClick = (provider: Provider) => {
    setDeleteDialog({ open: true, provider });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.provider?.id) {
      onDelete(deleteDialog.provider.id);
      setDeleteDialog({ open: false, provider: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, provider: null });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Cargando proveedores...</Typography>
      </Box>
    );
  }

  if (providers.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No hay proveedores registrados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Haz clic en "Nuevo Proveedor" para agregar el primero
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Razón Social</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nombre Comercial</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>RUC</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>País</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Facturación</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sitio Web</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Última Edición</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providers.map((provider) => (
              <TableRow 
                key={provider.id}
                sx={{ 
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {provider.razonSocial}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {provider.nombreComercial}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {provider.ruc}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={provider.pais} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                      {formatCurrency(provider.facturacionAnual)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Link 
                    href={provider.sitioWeb} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <Language sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {provider.sitioWeb.replace(/^https?:\/\//, '')}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {provider.fechaUltimaEdicion ? formatDate(provider.fechaUltimaEdicion) : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Ver detalles">
                      <IconButton 
                        size="small" 
                        onClick={() => onView(provider)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(provider)}
                        sx={{ color: 'warning.main' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Screening">
                      <IconButton 
                        size="small" 
                        onClick={() => onScreening(provider)}
                        sx={{ color: 'info.main' }}
                      >
                        <Security fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(provider)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el proveedor{' '}
            <strong>{deleteDialog.provider?.razonSocial}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{ ml: 1 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProviderTable;