import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {useAutenticacion} from '../hooks/useAutenticacion';
import  useReservas  from '../hooks/useReservas';
import { colors, spacing, typography, radius } from '../theme';

const Dato = ({ icono, etiqueta, valor }) => (
  <View style={styles.dato}>
    <Ionicons name={icono} size={20} color={colors.primario} />
    <View>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  </View>
);

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAutenticacion();
  const { reservas } = useReservas();

  const confirmarCierre = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: cerrarSesion },
    ]);
  };

  const inicial = usuario?.nombre?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <View style={styles.contenedor}>
      <View style={styles.avatar}>
        <Text style={styles.inicial}>{inicial}</Text>
      </View>
      <Text style={styles.nombre}>{usuario?.nombre}</Text>

      <View style={styles.card}>
        <Dato icono="mail-outline" etiqueta="Correo" valor={usuario?.email} />
        <Dato icono="calendar-outline" etiqueta="Clases reservadas" valor={String(reservas.length)} />
      </View>

      <TouchableOpacity style={styles.boton} onPress={confirmarCierre}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', padding: spacing.lg, backgroundColor: colors.fondo },
  avatar: {
    width: 88, height: 88, borderRadius: 44, marginTop: spacing.lg,
    backgroundColor: colors.primarioSuave, alignItems: 'center', justifyContent: 'center',
  },
  inicial: { fontSize: 36, fontWeight: '700', color: colors.primario },
  nombre: { ...typography.cuerpo, fontSize: 20, fontWeight: '700', color: colors.texto, marginVertical: spacing.md },
  card: {
    alignSelf: 'stretch', backgroundColor: colors.superficie, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.borde, padding: spacing.md, gap: spacing.md,
  },
  dato: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  etiqueta: { fontSize: 12, color: colors.textoSuave },
  valor: { ...typography.cuerpo, color: colors.texto, fontWeight: '600' },
  boton: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.xl ?? 32,
    backgroundColor: colors.error ?? '#C62828', paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: radius.lg,
  },
  botonTexto: { color: '#fff', fontWeight: '700' },
});