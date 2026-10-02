import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import EtiquetaNivel from './EtiquetaNivel';
import { spacing, colors, sombra, typography, radius } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function Card({ clase, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${clase.titulo}`}
      style={({ pressed }) => [
        styles.card,
        sombra,
        pressed && styles.presionada,
      ]}
    >
      <Image
        source={{ uri: clase.imagen }}
        style={styles.imagen}
        resizeMode="cover"
      />

      <View style={styles.cuerpo}>
        <EtiquetaNivel nivel={clase.nivel} />

        <Text style={styles.titulo} numberOfLines={2}>
          {clase.titulo}
        </Text>

        <View style={styles.profesor}>
          <Ionicons
            name="person-circle-outline"
            size={18}
            color={colors.textoSuave}
          />
          <Text style={styles.profesorNombre} numberOfLines={1}>
            {clase.profesor.nombre}
          </Text>
        </View>

        <View style={styles.pie}>
          <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textoSuave}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    overflow: 'hidden',
  },
  presionada: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  imagen: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.primarioSuave,
  },
  cuerpo: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.texto,
  },
  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profesorNombre: {
    flexShrink: 1,
    fontSize: 13,
    color: colors.textoSuave,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  precio: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primario,
  },
});
