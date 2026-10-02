import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_RESERVAS = 'reservas';

export const ReservasContext = createContext(null);

export function useReservas() {
  const ctx = useContext(ReservasContext);
  if (!ctx) {
    throw new Error('useReservas debe usarse dentro de ReservasProvider');
  }
  return ctx;
}

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar una sola vez al montar (ignora reservas con formato viejo)
  useEffect(() => {
    const cargar = async () => {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
        if (guardado !== null) {
          const lista = JSON.parse(guardado);
          setReservas(lista.filter((r) => r.horarioId));
        }
      } catch (error) {
        console.log('Error leyendo las reservas:', error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // 2. Guardar cuando cambien, solo después de haber cargado
  useEffect(() => {
    if (cargando) return;
    AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)).catch(
      (error) => console.log('Error al guardar reservas:', error)
    );
  }, [reservas, cargando]);

  const agregarReserva = useCallback(
    (clase, horario) => {
      if (reservas.some((r) => r.claseId === clase.id)) {
        return { ok: false, mensaje: 'Ya tienes una reserva para esta clase' };
      }

      const nueva = {
        id: `${clase.id}_${horario.id}`,
        claseId: clase.id,
        titulo: clase.titulo,
        nivel: clase.nivel,
        profesor: clase.profesor.nombre,
        precio: clase.precio,
        horarioId: horario.id,
        dia: horario.dia,
        hora: horario.hora,
        creadaEn: new Date().toISOString(),
      };

      setReservas((previa) => [nueva, ...previa]);
      return { ok: true };
    },
    [reservas]
  );

  const cancelarReserva = useCallback((id) => {
    setReservas((previa) => previa.filter((r) => r.id !== id));
  }, []);

  const actualizarReserva = useCallback((id, cambios) => {
    setReservas((previa) =>
      previa.map((r) => (r.id === id ? { ...r, ...cambios } : r))
    );
  }, []);

  const obtenerReserva = useCallback(
    (claseId) => reservas.find((r) => r.claseId === claseId),
    [reservas]
  );

  const valor = useMemo(
    () => ({
      reservas,
      cargando,
      agregarReserva,
      cancelarReserva,
      actualizarReserva,
      obtenerReserva,
    }),
    [
      reservas,
      cargando,
      agregarReserva,
      cancelarReserva,
      actualizarReserva,
      obtenerReserva,
    ]
  );

  return (
    <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>
  );
}

export default ReservasProvider;