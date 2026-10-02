import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { spacing, colors, radius } from '../theme';

export default function NivelFiltro({ etiqueta, activo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      accessibilityLabel={`Filtrar por nivel ${etiqueta}`}
      style={({ pressed }) => [
        styles.chip,
        activo && styles.chipActivo,
        pressed && styles.presionado,
      ]}
    >
      <Text style={[styles.texto, activo && styles.textoActivo]}>
        {etiqueta}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  chipActivo: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  presionado: { opacity: 0.7 },
  texto: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textoSuave,
  },
  textoActivo: { color: '#FFFFFF' },
});