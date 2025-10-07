import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Provider, ProviderFormData } from '../types/Provider';
import { PAISES } from '../types/Provider';

interface ProviderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProviderFormData) => Promise<void>;
  provider?: Provider | null;
  loading?: boolean;
}

// Validation schema
const schema = yup.object({
  razonSocial: yup
    .string()
    .required('La razón social es requerida')
    .min(3, 'La razón social debe tener al menos 3 caracteres'),
  nombreComercial: yup
    .string()
    .required('El nombre comercial es requerido')
    .min(3, 'El nombre comercial debe tener al menos 3 caracteres'),
  ruc: yup
    .string()
    .required('La Identificacion Tributaria es requerido'),
  telefono: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Formato de teléfono inválido'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Formato de email inválido'),
  sitioWeb: yup
    .string()
    .required('El sitio web es requerido')
    .url('Debe ser una URL válida (ej: https://ejemplo.com)'),
  direccion: yup
    .string()
    .required('La dirección es requerida')
    .min(10, 'La dirección debe tener al menos 10 caracteres'),
  pais: yup
    .string()
    .required('El país es requerido'),
  facturacionAnual: yup
    .number()
    .required('La facturación anual es requerida')
    .positive('La facturación debe ser un número positivo')
    .min(1, 'La facturación debe ser mayor a 0')
});

const ProviderForm: React.FC<ProviderFormProps> = ({
  open,
  onClose,
  onSubmit,
  provider,
  loading = false
}) => {
  const isEditing = !!provider;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<ProviderFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      razonSocial: provider?.razonSocial || '',
      nombreComercial: provider?.nombreComercial || '',
      ruc: provider?.ruc || '',
      telefono: provider?.telefono || '',
      email: provider?.email || '',
      sitioWeb: provider?.sitioWeb || '',
      direccion: provider?.direccion || '',
      pais: provider?.pais || '',
      facturacionAnual: provider?.facturacionAnual || 0
    },
    mode: 'onChange'
  });

  React.useEffect(() => {
    if (provider) {
      reset({
        razonSocial: provider.razonSocial,
        nombreComercial: provider.nombreComercial,
        ruc: provider.ruc,
        telefono: provider.telefono,
        email: provider.email,
        sitioWeb: provider.sitioWeb,
        direccion: provider.direccion,
        pais: provider.pais,
        facturacionAnual: provider.facturacionAnual
      });
    } else {
      reset({
        razonSocial: '',
        nombreComercial: '',
        ruc: '',
        telefono: '',
        email: '',
        sitioWeb: '',
        direccion: '',
        pais: '',
        facturacionAnual: 0
      });
    }
  }, [provider, reset]);

  const handleFormSubmit = async (data: ProviderFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="razonSocial"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Razón Social"
                    fullWidth
                    error={!!errors.razonSocial}
                    helperText={errors.razonSocial?.message}
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="nombreComercial"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Comercial"
                    fullWidth
                    error={!!errors.nombreComercial}
                    helperText={errors.nombreComercial?.message}
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="ruc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Identificación Tributaria"
                    fullWidth
                    error={!!errors.ruc}
                    helperText={errors.ruc?.message}
                    variant="outlined"
                    inputProps={{ maxLength: 11 }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="sitioWeb"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sitio Web"
                    fullWidth
                    error={!!errors.sitioWeb}
                    helperText={errors.sitioWeb?.message}
                    variant="outlined"
                    placeholder="https://ejemplo.com"
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección Física"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message}
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="pais"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="País"
                    fullWidth
                    error={!!errors.pais}
                    helperText={errors.pais?.message}
                    variant="outlined"
                  >
                    {PAISES.map((pais) => (
                      <MenuItem key={pais} value={pais}>
                        {pais}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="facturacionAnual"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Facturación Anual (USD)"
                    type="number"
                    fullWidth
                    error={!!errors.facturacionAnual}
                    helperText={errors.facturacionAnual?.message}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProviderForm;