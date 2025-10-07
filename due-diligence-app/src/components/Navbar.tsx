import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Business } from '@mui/icons-material';

const Navbar: React.FC = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#1976d2',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Business sx={{ mr: 2, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            Due Diligence App
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.8,
            fontStyle: 'italic'
          }}
        >
          Gestión de Proveedores y Screening de Riesgo
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;