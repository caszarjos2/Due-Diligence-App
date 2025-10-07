export interface Provider {
  id?: number;
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  telefono: string;
  email: string;
  sitioWeb: string;
  direccion: string;
  pais: string;
  facturacionAnual: number;
  fechaUltimaEdicion?: string;
}

export interface ProviderFormData {
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  telefono: string;
  email: string;
  sitioWeb: string;
  direccion: string;
  pais: string;
  facturacionAnual: number;
}

export interface ScreeningResult {
  fuente: string;
  entidadCoincidente: string;
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto';
  fechaActualizacion: string;
}

export interface ScreeningRequest {
  fuentes: string[];
}

export const PAISES = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'España',
  'Estados Unidos',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Puerto Rico',
  'República Dominicana',
  'Uruguay',
  'Venezuela'
];

export const FUENTES_SCREENING = [
  'OFAC',
  'World Bank',
  'Offshore Leaks'
];