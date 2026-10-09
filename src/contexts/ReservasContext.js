import React, { createContext, useState, useEffect, useCallback, useMemo, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAutenticacion } from '../hooks/useAutenticacion';

export const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
  const { usuario } = useAutenticacion();
  const clave = usuario ? `reservas_${usuario.id}` : null;

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  // Clave para la que ya se cargaron las reservas; evita guardar datos de un usuario en la clave de otro
  const cargadaPara = useRef(null);

  // 1. Cargar al montar y cada vez que cambia el usuario
  useEffect(() => {
    let cancelado = false;
    cargadaPara.current = null;
    setReservas([]);

    if (!clave) {
      setCargando(false);
      return;
    }

    setCargando(true);
    (async () => {
      try {
        const guardado = await AsyncStorage.getItem(clave);
        if (cancelado) return;
        if (guardado !== null) {
          const lista = JSON.parse(guardado);
          setReservas(lista.filter((r) => r.horarioId));
        }
      } catch (error) {
        console.log('Error leyendo las reservas:', error);
      } finally {
        if (!cancelado) {
          cargadaPara.current = clave;
          setCargando(false);
        }
      }
    })();

    return () => { cancelado = true; };
  }, [clave]);

  // 2. Guardar solo si las reservas en memoria corresponden a esta clave
  useEffect(() => {
    if (!clave || cargadaPara.current !== clave) return;
    AsyncStorage.setItem(clave, JSON.stringify(reservas)).catch((error) =>
      console.log('Error al guardar reservas:', error)
    );
  }, [reservas, clave]);


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