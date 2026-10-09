import { useContext } from 'react';
import { AutenticacionContext } from '../contexts/AutenticacionContext';

export const useAutenticacion = () => {
  const contexto = useContext(AutenticacionContext);
  if (!contexto) throw new Error('useAutenticacion debe usarse dentro de AuthProvider');
  return contexto;
};