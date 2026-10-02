import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, colors, radius } from '../theme';

// Colores por nivel: fondo suave + texto más fuerte del mismo tono
const COLORES_NIVEL = {
  basico: { fondo: '#DCFCE7', texto: '#166534' },
  intermedio: { fondo: '#FEF3C7', texto: '#92400E' },
  avanzado: { fondo: '#FEE2E2', texto: '#991B1B' },
};

// Si el nivel no está en el mapa, usa los colores del tema
const POR_DEFECTO = { fondo: colors.primarioSuave, texto: colors.primario };

// Quita tildes y mayúsculas para que "Básico", "basico" y "BÁSICO" coincidan
const normalizar = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function EtiquetaNivel({ nivel }) {
  const paleta = COLORES_NIVEL[normalizar(nivel)] ?? POR_DEFECTO;

  return (
    <View style={[styles.contenedor, { backgroundColor: paleta.fondo }]}>
      <Text style={[styles.texto, { color: paleta.texto }]}>{nivel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  texto: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});