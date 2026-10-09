import React, { createContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const USUARIOS_KEY = 'usuarios';
const SESION_KEY = 'sesion';

export const AutenticacionContext = createContext(null);

const normalizar = (email) => email.trim().toLowerCase();

// Hash con sal (el correo). Es suficiente para una app local sin backend.
const hashClave = (email, clave) =>
  Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${normalizar(email)}::${clave}`
  );

async function leerUsuarios() {
  const raw = await AsyncStorage.getItem(USUARIOS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function AutenticacionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Restaura la sesión al abrir la app
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESION_KEY);
        if (raw) setUsuario(JSON.parse(raw));
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const guardarSesion = async (u) => {
    const publico = { id: u.id, nombre: u.nombre, email: u.email };
    await AsyncStorage.setItem(SESION_KEY, JSON.stringify(publico));
    setUsuario(publico);
  };

  // Devuelve { ok: true } o { ok: false, motivo: 'no-registrado' | 'clave-incorrecta' }
  const iniciarSesion = useCallback(async (email, clave) => {
    const usuarios = await leerUsuarios();
    const encontrado = usuarios.find((u) => u.email === normalizar(email));
    if (!encontrado) return { ok: false, motivo: 'no-registrado' };

    const hash = await hashClave(email, clave);
    if (hash !== encontrado.claveHash) return { ok: false, motivo: 'clave-incorrecta' };

    await guardarSesion(encontrado);
    return { ok: true };
  }, []);

  // Devuelve { ok: true } o { ok: false, motivo: 'ya-existe' }
  const registrar = useCallback(async ({ nombre, email, clave }) => {
    const usuarios = await leerUsuarios();
    const correo = normalizar(email);
    if (usuarios.some((u) => u.email === correo)) return { ok: false, motivo: 'ya-existe' };

    const nuevo = {
      id: `${Date.now()}`,
      nombre: nombre.trim(),
      email: correo,
      claveHash: await hashClave(correo, clave),
    };
    await AsyncStorage.setItem(USUARIOS_KEY, JSON.stringify([...usuarios, nuevo]));
    await guardarSesion(nuevo); // queda con la sesión iniciada
    return { ok: true };
  }, []);

  const cerrarSesion = useCallback(async () => {
    await AsyncStorage.removeItem(SESION_KEY);
    setUsuario(null);
  }, []);

  return (
    <AutenticacionContext.Provider value={{ usuario, cargando, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AutenticacionContext.Provider>
  );
  
}