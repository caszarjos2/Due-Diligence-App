import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Link,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  Close,
  Business,
  Phone,
  Email,
  Language,
  LocationOn,
  AttachMoney,
  CalendarToday,
  Public
} from '@mui/icons-material';
import type { Provider } from '../types/Provider';

interface ProviderDetailsProps {
  open: boolean;
  onClose: () => void;
  provider: Provider | null;
}

const ProviderDetails: React.FC<ProviderDetailsProps> = ({
  open,
  onClose,
  provider
}) => {
  if (!provider) return null;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    isLink?: boolean;
    linkHref?: string;
  }> = ({ icon, label, value, isLink = false, linkHref }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Box sx={{ mr: 2, mt: 0.5, color: 'primary.main' }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {isLink && linkHref ? (
          <Link 
            href={linkHref} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {value}
            </Typography>
          </Link>
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Detalles del Proveedor
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Basic Information Card */}
          <Grid size={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Información Básica
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem
                      icon={<Business />}
                      label="Razón Social"
                      value={provider.razonSocial}
                    />
                    <InfoItem
                      icon={<Business />}
                      label="Nombre Comercial"
                      value={provider.nombreComercial}
                    />
                    <InfoItem
                      icon={<Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#</Typography>}
                      label="Identificacion Tributaria"
                      value={provider.ruc}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem
                      icon={<Public />}
                      label="País"
                      value={provider.pais}
                    />
                    <InfoItem
                      icon={<AttachMoney />}
                      label="Facturación Anual"
                      value={formatCurrency(provider.facturacionAnual)}
                    />
                    {provider.fechaUltimaEdicion && (
                      <InfoItem
                        icon={<CalendarToday />}
                        label="Última Edición"
                        value={formatDate(provider.fechaUltimaEdicion)}
                      />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information Card */}
          <Grid size={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Información de Contacto
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem
                      icon={<Phone />}
                      label="Teléfono"
                      value={provider.telefono}
                    />
                    <InfoItem
                      icon={<Email />}
                      label="Email"
                      value={provider.email}
                      isLink
                      linkHref={`mailto:${provider.email}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <InfoItem
                      icon={<Language />}
                      label="Sitio Web"
                      value={provider.sitioWeb}
                      isLink
                      linkHref={provider.sitioWeb}
                    />
                    <InfoItem
                      icon={<LocationOn />}
                      label="Dirección"
                      value={provider.direccion}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Chip */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Chip 
                label="Proveedor Activo" 
                color="success" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderDetails;