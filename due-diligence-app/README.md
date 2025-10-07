# Due Diligence App - Frontend

Una aplicación moderna de React + TypeScript para la gestión de proveedores y screening de riesgo contra listas internacionales.

## 🚀 Características

- **CRUD completo de proveedores** con validaciones robustas
- **Screening de riesgo** contra listas OFAC, World Bank y Offshore Leaks
- **Interfaz empresarial** con Material UI y Tailwind CSS
- **Formularios reactivos** con React Hook Form y Yup
- **Diseño responsivo** y profesional
- **Notificaciones** en tiempo real
- **Gestión de estado** con React Query

## 🛠️ Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Estilos**: Material UI v5 + Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Yup validations
- **HTTP Client**: Axios
- **State Management**: React Query
- **Build Tool**: Vite

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.tsx      # Barra de navegación
│   ├── ProviderForm.tsx    # Formulario de proveedores
│   ├── ProviderTable.tsx   # Tabla de proveedores
│   ├── ProviderDetails.tsx # Detalles del proveedor
│   └── ScreeningModal.tsx  # Modal de screening
├── pages/
│   └── ProvidersPage.tsx   # Página principal
├── services/
│   └── api.ts             # Configuración de API
├── types/
│   └── Provider.ts        # Tipos TypeScript
├── App.tsx               # Componente principal
└── main.tsx             # Punto de entrada
```

## 🔧 Configuración de API

La aplicación está configurada para conectarse al backend en:
```
https://localhost:7058/api
```

### Endpoints utilizados:
- `GET /providers` - Obtener todos los proveedores
- `GET /providers/{id}` - Obtener proveedor por ID
- `POST /providers` - Crear nuevo proveedor
- `PUT /providers/{id}` - Actualizar proveedor
- `DELETE /providers/{id}` - Eliminar proveedor
- `GET /providers/{id}/screening?fuentes=OFAC,WorldBank,OffshoreLeaks` - Screening de riesgo

### Formato de respuesta del Screening:
```json
{
  "company name": "Empresa Ejemplo",
  "ofac": [
    ["Nombre", "Dirección", "Tipo", "Programa", "Lista", "Score"]
  ],
  "worldbank": [
    ["Nombre Empresa", "Dirección", "País", "Fecha Desde", "Fecha Hasta", "Motivos"]
  ],
  "offshore": [
    ["Entidad", "Jurisdicción", "Vinculado a", "Fuente de Datos"]
  ]
}
```

## 📋 Modelo de Datos

### Proveedor
```typescript
interface Provider {
  id?: number;
  razonSocial: string;           // Razón social (requerido)
  nombreComercial: string;       // Nombre comercial (requerido)
  ruc: string;                   // RUC de 11 dígitos (requerido)
  telefono: string;              // Teléfono (requerido)
  email: string;                 // Email válido (requerido)
  sitioWeb: string;              // URL válida (requerido)
  direccion: string;             // Dirección física (requerido)
  pais: string;                  // País (requerido)
  facturacionAnual: number;      // Facturación en USD (requerido)
  fechaUltimaEdicion?: string;   // Fecha automática
}
```

## 🎯 Funcionalidades

### ✅ Gestión de Proveedores
- Crear, editar, eliminar y ver proveedores
- Validaciones en tiempo real
- Tabla ordenada por fecha de última edición
- Estadísticas en dashboard

### ✅ Screening de Riesgo
- **Selección de fuentes**: OFAC, World Bank, Offshore Leaks
- **Tablas específicas** para cada fuente con sus propios campos:
  - **OFAC**: Nombre, Dirección, Tipo, Programa(s), Lista, Score
  - **World Bank**: Nombre de Empresa, Dirección, País, Fechas, Motivos
  - **Offshore Leaks**: Entidad, Jurisdicción, Vinculado a, Fuente de Datos
- **Visualización condicional**: Solo muestra tablas con resultados
- **Alertas inteligentes**: Diferentes colores según el nivel de riesgo
- **Acciones adicionales**: Generar reporte PDF, marcar como alto riesgo

### ✅ Validaciones
- RUC: 11 dígitos exactos
- Email: formato válido
- Sitio web: URL válida
- Teléfono: formato internacional
- Facturación: número positivo

### ✅ UX/UI
- Diseño Material Design empresarial
- Notificaciones toast
- Modales responsivos
- Confirmaciones de eliminación
- Estados de carga

## 🌐 Navegación

- `/` - Página principal con lista de proveedores
- `/providers` - Alias de la página principal

## 🎨 Tema y Estilos

La aplicación utiliza un tema personalizado de Material UI con:
- **Colores primarios**: Azul empresarial (#1976d2)
- **Tipografía**: Roboto
- **Componentes**: Bordes redondeados y sombras suaves
- **Responsive**: Adaptable a móviles y tablets

## 🔒 Consideraciones de Seguridad

- Validación de datos en frontend y backend
- Sanitización de URLs
- Manejo seguro de certificados SSL en desarrollo
- Validaciones de formularios robustas

## 🐛 Debugging

Para debugging, la aplicación incluye:
- Logs de requests HTTP en consola
- Manejo de errores con notificaciones
- Estados de carga visibles
- Mensajes de error descriptivos

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Columnas adaptadas
- **Mobile**: Vista optimizada para móviles

## 🚀 Deployment

Para producción:

```bash
npm run build
```

Los archivos se generan en `dist/` y pueden servirse desde cualquier servidor web estático.

---

**Desarrollado con ❤️ usando React + TypeScript + Material UI**