import React from 'react';
import {View, Text,FlatList,Image,TouchableOpacity,Alert,StyleSheet,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import  useReservas  from '../hooks/useReservas';
import { CLASES, formatearPrecio } from '../data/clases';
import { colors, spacing, typography, radius } from '../theme';

export default function MisReservasScreen({ navigation }) {
  const { reservas, cargando, cancelarReserva } = useReservas();

  const confirmarCancelacion = (reserva) => {
    Alert.alert(
      'Cancelar reserva',
      `¿Quieres cancelar "${reserva.titulo}" (${reserva.dia} · ${reserva.hora})?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => cancelarReserva(reserva.id),
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const clase = CLASES.find((c) => c.id === item.claseId);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.fila}
          activeOpacity={0.8}
          disabled={!clase}
          onPress={() =>
            navigation.navigate('ClasesTab', {
              screen: 'DetalleClase',
              params: { clase },
            })
          }
        >
          {clase?.imagen && <Image source={clase.imagen} style={styles.imagen} />}

          <View style={styles.info}>
            <Text style={styles.titulo} numberOfLines={2}>
              {item.titulo}
            </Text>
            <Text style={styles.sub}>{item.profesor}</Text>

            <View style={styles.horarioFila}>
              <Ionicons name="time-outline" size={14} color={colors.primario} />
              <Text style={styles.horario}>
                {item.dia} · {item.hora}
              </Text>
            </View>

            <Text style={styles.sub}>{formatearPrecio(item.precio)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelar}
          onPress={() => confirmarCancelacion(item)}
        >
          <Ionicons
            name="close-circle-outline"
            size={18}
            color={colors.error ?? '#C62828'}
          />
          <Text style={styles.cancelarTexto}>Cancelar reserva</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (cargando) return null;

  return (
    <FlatList
      data={reservas}
      keyExtractor={(r) => r.id}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.lista,
        reservas.length === 0 && styles.vacioContenedor,
      ]}
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Ionicons name="calendar-outline" size={48} color={colors.textoSuave} />
          <Text style={styles.vacioTitulo}>Aún no tienes reservas</Text>
          <Text style={styles.vacioTexto}>Reserva una clase y aparecerá aquí.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ClasesTab')}>
            <Text style={styles.link}>Ver clases</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: { padding: spacing.md, gap: spacing.md },
  vacioContenedor: { flexGrow: 1, justifyContent: 'center' },
  card: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    overflow: 'hidden',
  },
  fila: { flexDirection: 'row', padding: spacing.md, gap: spacing.md },
  imagen: { width: 84, height: 84, borderRadius: radius.md ?? 8 },
  info: { flex: 1, gap: 2 },
  titulo: { ...typography.cuerpo, fontWeight: '700', color: colors.texto },
  sub: { ...typography.cuerpo, color: colors.textoSuave, fontSize: 13 },
  horarioFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 2,
  },
  horario: { color: colors.primario, fontWeight: '600', fontSize: 13 },
  cancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
  },
  cancelarTexto: { color: colors.error ?? '#C62828', fontWeight: '600' },
  vacio: { alignItems: 'center', gap: spacing.sm },
  vacioTitulo: { ...typography.cuerpo, fontWeight: '700', color: colors.texto },
  vacioTexto: { ...typography.cuerpo, color: colors.textoSuave },
  link: { color: colors.primario, fontWeight: '700', marginTop: spacing.sm },
});