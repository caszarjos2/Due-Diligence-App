import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import type { Provider, ProviderFormData } from '../types/Provider';
import { providerApi } from '../services/api';
import ProviderTable from '../components/ProviderTable';
import ProviderForm from '../components/ProviderForm';
import ProviderDetails from '../components/ProviderDetails';
import ScreeningModal from '../components/ScreeningModal';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [screeningOpen, setScreeningOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await providerApi.getAll();
      // Sort by last edit date (most recent first)
      const sortedData = data.sort((a, b) => {
        if (!a.fechaUltimaEdicion && !b.fechaUltimaEdicion) return 0;
        if (!a.fechaUltimaEdicion) return 1;
        if (!b.fechaUltimaEdicion) return -1;
        return new Date(b.fechaUltimaEdicion).getTime() - new Date(a.fechaUltimaEdicion).getTime();
      });
      setProviders(sortedData);
    } catch (error) {
      console.error('Error loading providers:', error);
      showSnackbar('Error al cargar los proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Form handlers
  const handleNewProvider = () => {
    setSelectedProvider(null);
    setFormOpen(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: ProviderFormData) => {
    try {
      setFormLoading(true);
      
      if (selectedProvider?.id) {
        // Update existing provider
        await providerApi.update(selectedProvider.id, data);
        showSnackbar('Proveedor actualizado exitosamente', 'success');
      } else {
        // Create new provider
        await providerApi.create(data);
        showSnackbar('Proveedor creado exitosamente', 'success');
      }
      
      await loadProviders(); // Reload the list
      setFormOpen(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error saving provider:', error);
      showSnackbar(
        selectedProvider ? 'Error al actualizar el proveedor' : 'Error al crear el proveedor',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProvider(null);
  };

  // Details handlers
  const handleViewProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedProvider(null);
  };

  // Delete handler
  const handleDeleteProvider = async (id: number) => {
    try {
      await providerApi.delete(id);
      showSnackbar('Proveedor eliminado exitosamente', 'success');
      await loadProviders(); // Reload the list
    } catch (error) {
      console.error('Error deleting provider:', error);
      showSnackbar('Error al eliminar el proveedor', 'error');
    }
  };

  // Screening handlers
  const handleScreeningProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setScreeningOpen(true);
  };

  const handleScreeningClose = () => {
    setScreeningOpen(false);
    setSelectedProvider(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Gestión de Proveedores
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadProviders}
              disabled={loading}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleNewProvider}
              sx={{ minWidth: 160 }}
            >
              Nuevo Proveedor
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Administra la información de proveedores y realiza screening de riesgo contra listas internacionales
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {providers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Proveedores Registrados
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'success.main' }}>
                {providers.filter(p => p.facturacionAnual > 100000).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Facturación &gt; $100K
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'info.main' }}>
                {new Set(providers.map(p => p.pais)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Países Representados
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Providers Table */}
      <ProviderTable
        providers={providers}
        onView={handleViewProvider}
        onEdit={handleEditProvider}
        onDelete={handleDeleteProvider}
        onScreening={handleScreeningProvider}
        loading={loading}
      />

      {/* Provider Form Modal */}
      <ProviderForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        provider={selectedProvider}
        loading={formLoading}
      />

      {/* Provider Details Modal */}
      <ProviderDetails
        open={detailsOpen}
        onClose={handleDetailsClose}
        provider={selectedProvider}
      />

      {/* Screening Modal */}
      <ScreeningModal
        open={screeningOpen}
        onClose={handleScreeningClose}
        provider={selectedProvider}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProvidersPage;