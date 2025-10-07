import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close,
  Security,
  Search
} from '@mui/icons-material';
import type { Provider, ScreeningResult } from '../types/Provider';
import { FUENTES_SCREENING } from '../types/Provider';
import { providerApi } from '../services/api';

interface ScreeningModalProps {
  open: boolean;
  onClose: () => void;
  provider: Provider | null;
}

const ScreeningModal: React.FC<ScreeningModalProps> = ({
  open,
  onClose,
  provider
}) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSourceChange = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleScreening = async () => {
    if (!provider?.id || selectedSources.length === 0) return;

    setLoading(true);
    setError(null);
    setHasSearched(false);

    try {
      const screeningResults = await providerApi.screening(provider.id, selectedSources);
      setResults(screeningResults);
      setHasSearched(true);
    } catch (err) {
      console.error('Error during screening:', err);
      setError('Error al realizar el screening. Por favor intenta nuevamente.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSources([]);
    setResults([]);
    setError(null);
    setHasSearched(false);
    onClose();
  };

  const getRiskColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'bajo':
        return 'success';
      case 'medio':
        return 'warning';
      case 'alto':
        return 'error';
      default:
        return 'default';
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (!provider) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: '60vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Security sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Screening de Riesgo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {provider.razonSocial}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Source Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Seleccionar Fuentes de Screening
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona de 1 a 3 fuentes para realizar el cruce con listas de alto riesgo:
          </Typography>
          
          <FormGroup row>
            {FUENTES_SCREENING.map((source) => (
              <FormControlLabel
                key={source}
                control={
                  <Checkbox
                    checked={selectedSources.includes(source)}
                    onChange={() => handleSourceChange(source)}
                    disabled={loading}
                  />
                }
                label={source}
                sx={{ mr: 3 }}
              />
            ))}
          </FormGroup>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleScreening}
              disabled={selectedSources.length === 0 || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Procesando...' : 'Ejecutar Screening'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results Section */}
        {hasSearched && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Resultados del Screening
            </Typography>
            
            {results.length === 0 ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ✅ No se encontraron coincidencias
                </Typography>
                <Typography variant="body2">
                  El proveedor no aparece en las listas de riesgo consultadas.
                </Typography>
              </Alert>
            ) : (
              <>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ⚠️ Se encontraron {results.length} coincidencia(s)
                  </Typography>
                  <Typography variant="body2">
                    Revisa cuidadosamente los resultados antes de proceder.
                  </Typography>
                </Alert>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Fuente</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Entidad Coincidente</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Nivel de Riesgo</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha de Actualización</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((result, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:hover': { backgroundColor: '#f9f9f9' },
                            backgroundColor: result.nivelRiesgo === 'Alto' ? '#ffebee' : 'inherit'
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {result.fuente}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {result.entidadCoincidente}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={result.nivelRiesgo}
                              color={getRiskColor(result.nivelRiesgo) as any}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(result.fechaActualizacion)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        )}

        {/* Instructions */}
        {!hasSearched && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Security sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Screening de Listas de Riesgo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Selecciona las fuentes y haz clic en "Ejecutar Screening" para comenzar
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
        >
          Cerrar
        </Button>
        {hasSearched && results.length > 0 && (
          <Button 
            variant="contained"
            color="warning"
            sx={{ ml: 1 }}
          >
            Generar Reporte
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningModal;