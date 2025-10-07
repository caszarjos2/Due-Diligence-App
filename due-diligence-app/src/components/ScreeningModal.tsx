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
import type { 
  Provider, 
  ScreeningResponse, 
  ProcessedScreeningResults,
  OFACResult,
  WorldBankResult,
  OffshoreResult
} from '../types/Provider';
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
  const [results, setResults] = useState<ProcessedScreeningResults | null>(null);
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

  // Función para procesar los datos del screening
  const processScreeningData = (data: ScreeningResponse): ProcessedScreeningResults => {
    const processOFAC = (ofacData: string[][]): OFACResult[] => {
      return ofacData.map(row => ({
        name: row[0] || '',
        address: row[1] || '',
        type: row[2] || '',
        programs: row[3] || '',
        list: row[4] || '',
        score: row[5] || ''
      }));
    };

    const processWorldBank = (wbData: string[][]): WorldBankResult[] => {
      return wbData.map(row => ({
        firmName: row[0] || '',
        address: row[1] || '',
        country: row[2] || '',
        fromDate: row[3] || '',
        toDate: row[4] || '',
        grounds: row[5] || ''
      }));
    };

    const processOffshore = (offshoreData: string[][]): OffshoreResult[] => {
      return offshoreData.map(row => ({
        entity: row[0] || '',
        jurisdiction: row[1] || '',
        linkedTo: row[2] || '',
        dataFrom: row[3] || ''
      }));
    };

    return {
      companyName: data['company name'],
      ofac: processOFAC(data.ofac || []),
      worldbank: processWorldBank(data.worldbank || []),
      offshore: processOffshore(data.offshore || [])
    };
  };

  const handleScreening = async () => {
    if (!provider?.id || selectedSources.length === 0) return;

    setLoading(true);
    setError(null);
    setHasSearched(false);

    try {
      const screeningResponse = await providerApi.screening(provider.id, selectedSources);
      const processedResults = processScreeningData(screeningResponse);
      setResults(processedResults);
      setHasSearched(true);
    } catch (err) {
      console.error('Error during screening:', err);
      setError('Error al realizar el screening. Por favor intenta nuevamente.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSources([]);
    setResults(null);
    setError(null);
    setHasSearched(false);
    onClose();
  };

  const getTotalResults = () => {
    if (!results) return 0;
    return results.ofac.length + results.worldbank.length + results.offshore.length;
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
        {hasSearched && results && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Resultados del Screening para: {results.companyName}
            </Typography>
            
            {getTotalResults() === 0 ? (
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
                    ⚠️ Se encontraron {getTotalResults()} coincidencia(s)
                  </Typography>
                  <Typography variant="body2">
                    Revisa cuidadosamente los resultados antes de proceder.
                  </Typography>
                </Alert>

                {/* OFAC Results Table */}
                {results.ofac.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'error.main', fontWeight: 600 }}>
                      🚨 OFAC - Office of Foreign Assets Control ({results.ofac.length} resultados)
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#ffebee' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Dirección</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Programa(s)</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Lista</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.ofac.map((result, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {result.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.address}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={result.type} size="small" color="error" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.programs}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={result.list} size="small" color="warning" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                                  {result.score}%
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* World Bank Results Table */}
                {results.worldbank.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'warning.main', fontWeight: 600 }}>
                      🏦 World Bank - Debarred Firms ({results.worldbank.length} resultados)
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Nombre de la Empresa</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Dirección</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>País</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha Desde</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha Hasta</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Motivos</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.worldbank.map((result, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {result.firmName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.address}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={result.country} size="small" color="info" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.fromDate}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: result.toDate === 'Ongoing' ? 'error.main' : 'text.primary' }}>
                                  {result.toDate}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.grounds}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Offshore Leaks Results Table */}
                {results.offshore.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'info.main', fontWeight: 600 }}>
                      🏝️ Offshore Leaks Database ({results.offshore.length} resultados)
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Entidad</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Jurisdicción</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Vinculado a</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fuente de Datos</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.offshore.map((result, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {result.entity}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={result.jurisdiction} size="small" color="info" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.linkedTo}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {result.dataFrom}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
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
        {hasSearched && results && getTotalResults() > 0 && (
          <>
            <Button 
              variant="contained"
              color="warning"
              sx={{ ml: 1 }}
            >
              Generar Reporte PDF
            </Button>
            <Button 
              variant="contained"
              color="error"
              sx={{ ml: 1 }}
            >
              Marcar como Alto Riesgo
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningModal;