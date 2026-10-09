import { useContext } from 'react';
import { ReservasContext } from '../contexts/ReservasContext';

export default function useReservas() {
  const contexto = useContext(ReservasContext);
  if (!contexto) {
    throw new Error('useReservas debe usarse dentro de <ReservasProvider>');
  }
  return contexto;
}