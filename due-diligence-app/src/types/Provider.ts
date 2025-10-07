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

// Tipos para los resultados de screening por fuente
export interface OFACResult {
  name: string;
  address: string;
  type: string;
  programs: string;
  list: string;
  score: string;
}

export interface WorldBankResult {
  firmName: string;
  address: string;
  country: string;
  fromDate: string;
  toDate: string;
  grounds: string;
}

export interface OffshoreResult {
  entity: string;
  jurisdiction: string;
  linkedTo: string;
  dataFrom: string;
}

// Respuesta completa del screening
export interface ScreeningResponse {
  'company name': string;
  ofac: string[][];
  worldbank: string[][];
  offshore: string[][];
}

// Resultados procesados para mostrar en las tablas
export interface ProcessedScreeningResults {
  companyName: string;
  ofac: OFACResult[];
  worldbank: WorldBankResult[];
  offshore: OffshoreResult[];
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