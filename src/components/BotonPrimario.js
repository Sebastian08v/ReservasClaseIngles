// components/BotonPrimario.js
import React from 'react';
import { Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function BotonPrimario({
  titulo,
  onPress,
  variante = 'primario', // 'primario' | 'peligro'
  deshabilitado = false,
  cargando = false,
}) {
  const inactivo = deshabilitado || cargando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inactivo }}
      style={({ pressed }) => [
        styles.boton,
        variante === 'peligro' ? styles.peligro : styles.primario,
        pressed && styles.presionado,
        inactivo && styles.inactivo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: colors.primario },
  peligro: { backgroundColor: colors.peligro ?? '#D64545' },
  presionado: { opacity: 0.85 },
  inactivo: { opacity: 0.5 },
  texto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});