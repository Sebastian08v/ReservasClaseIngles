import React, { useState } from 'react';
import {View,Text,ScrollView,StyleSheet,Alert,Modal,Pressable} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import useResponsive from '../hooks/useResponsive';
import BotonPrimario from './BotonPrimario';
import { useReservas } from '../contexts/ReservasContext';
import { colors, spacing, radius } from '../theme';
import { formatearPrecio } from '../data/clases';

const DIAS = {
  Lun: 'Lunes',
  Mar: 'Martes',
  Mié: 'Miércoles',
  Jue: 'Jueves',
  Vie: 'Viernes',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

// 'Lun 7:00 a.m.' -> { dia: 'Lunes', hora: '7:00 a.m.' }
const dividirHorario = (texto) => {
  const [abreviatura, ...resto] = texto.split(' ');
  return { dia: DIAS[abreviatura] ?? abreviatura, hora: resto.join(' ') };
};

export default function ReservaItem({ clase }) {
  const insets = useSafeAreaInsets();
  const { paddingHorizontal } = useResponsive();
  const { agregarReserva, cancelarReserva, obtenerReserva, cargando } =
    useReservas();

  const [modalVisible, setModalVisible] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const horarios = (clase.horarios ?? []).map((texto) => ({
    id: texto,
    ...dividirHorario(texto),
  }));

  const reserva = obtenerReserva(clase.id);
  const reservada = Boolean(reserva);

  // Cada horario tiene `clase.cupos` lugares; si reservé ese, se descuenta uno
  const cuposBase = Number(clase.cupos) || 0;
  const cuposDe = (h) => cuposBase - (reserva?.horarioId === h.id ? 1 : 0);
  const claseConCupos = cuposBase > 0;

  const abrirHorarios = () => {
    setSeleccionado(null);
    setModalVisible(true);
  };

  const handleConfirmar = () => {
    const horario = horarios.find((h) => h.id === seleccionado);
    if (!horario) return;

    const resultado = agregarReserva(clase, horario);
    if (!resultado.ok) {
      Alert.alert('No se pudo reservar', resultado.mensaje);
      return;
    }

    setModalVisible(false);
    Alert.alert(
      'Reserva confirmada',
      `${clase.titulo}\n${horario.dia} a las ${horario.hora}`
    );
  };

  const handleCancelar = () => {
    Alert.alert('Cancelar reserva', '¿Seguro que quieres cancelar tu reserva?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => cancelarReserva(reserva.id),
      },
    ]);
  };

  return (
    <>
      {/* Barra fija inferior */}
      <View
        style={[
          styles.barra,
          { paddingHorizontal, paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <View style={styles.precioContenedor}>
          <Text style={styles.precioEtiqueta}>Precio</Text>
          <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>

        <View style={styles.botonContenedor}>
          {reservada ? (
            <BotonPrimario
              titulo="Cancelar reserva"
              variante="peligro"
              onPress={handleCancelar}
              deshabilitado={cargando}
            />
          ) : (
            <BotonPrimario
              titulo={claseConCupos ? 'Reservar' : 'Sin cupos'}
              onPress={abrirHorarios}
              deshabilitado={cargando || !claseConCupos || horarios.length === 0}
            />
          )}
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable
            style={[styles.hoja, { paddingBottom: insets.bottom + spacing.lg }]}
            onPress={() => {}}
          >
            <View style={styles.manija} />
            <Text style={styles.hojaTitulo}>Elige tu horario</Text>
            <Text style={styles.hojaSubtitulo}>{clase.titulo}</Text>

            <ScrollView
              style={styles.listaHorarios}
              showsVerticalScrollIndicator={false}
            >
              {horarios.map((h) => {
                const disponibles = cuposDe(h);
                const hayCupos = disponibles > 0;
                const activo = seleccionado === h.id;

                return (
                  <Pressable
                    key={h.id}
                    disabled={!hayCupos}
                    onPress={() => setSeleccionado(h.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: activo, disabled: !hayCupos }}
                    style={[
                      styles.opcion,
                      activo && styles.opcionActiva,
                      !hayCupos && styles.opcionInactiva,
                    ]}
                  >
                    <Ionicons
                      name={activo ? 'radio-button-on' : 'radio-button-off'}
                      size={22}
                      color={activo ? colors.primario : colors.textoSuave}
                    />
                    <View style={styles.opcionInfo}>
                      <Text style={styles.opcionDia}>{h.dia}</Text>
                      <Text style={styles.opcionHora}>{h.hora}</Text>
                    </View>
                    <Text
                      style={[
                        styles.opcionCupos,
                        !hayCupos && styles.opcionSinCupos,
                      ]}
                    >
                      {hayCupos ? `${disponibles} cupos` : 'Sin cupos'}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <BotonPrimario
              titulo="Confirmar reserva"
              onPress={handleConfirmar}
              deshabilitado={!seleccionado}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingTop: spacing.lg,
  },
  precioContenedor: { gap: 2 },
  precioEtiqueta: { fontSize: 12, color: colors.textoSuave },
  precio: { fontSize: 18, fontWeight: '800', color: colors.primario },
  botonContenedor: { flex: 1 },

  // Modal de horarios
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  hoja: {
    backgroundColor: colors.superficie,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  manija: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borde,
  },
  hojaTitulo: { fontSize: 20, fontWeight: '800', color: colors.texto },
  hojaSubtitulo: {
    fontSize: 14,
    color: colors.textoSuave,
    marginTop: -spacing.sm,
  },
  listaHorarios: { maxHeight: 320 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.superficie,
  },
  opcionActiva: {
    borderColor: colors.primario,
    backgroundColor: colors.primarioSuave,
  },
  opcionInactiva: { opacity: 0.5 },
  opcionInfo: { flex: 1, gap: 2 },
  opcionDia: { fontSize: 15, fontWeight: '700', color: colors.texto },
  opcionHora: { fontSize: 13, color: colors.textoSuave },
  opcionCupos: { fontSize: 12, fontWeight: '600', color: colors.primario },
  opcionSinCupos: { color: colors.textoSuave },
});