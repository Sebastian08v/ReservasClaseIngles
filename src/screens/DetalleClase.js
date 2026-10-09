import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import useResponsive from '../hooks/useResponsive';
import ReservaItem from '../components/ReservaItem';
import useReservas from '../hooks/useReservas';
import { colors, spacing, sombra, typography, radius } from '../theme';

export default function DetalleClase({ route, navigation }) {
  const { clase } = route.params;
  const { isTablet, paddingHorizontal } = useResponsive();
  const { obtenerReserva } = useReservas();

  const reserva = obtenerReserva(clase.id);
  const reservada = Boolean(reserva);

  const cuposBase = Number(clase.cupos) || 0;
  const cuposMostrados = reservada ? cuposBase - 1 : cuposBase;
  const totalHorarios = (clase.horarios ?? []).length;

  useLayoutEffect(() => {
    navigation.setOptions({ title: clase.titulo });
  }, [navigation, clase.titulo]);

  return (
    <View style={styles.pantalla}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: clase.imagen }}
          style={[styles.portada, { height: isTablet ? 300 : 200 }]}
          resizeMode="cover"
        />

        <View style={[styles.contenido, { paddingHorizontal }]}>
          {/* Nivel y título */}
          <View style={styles.badgeNivel}>
            <Text style={styles.badgeTexto}>{clase.nivel}</Text>
          </View>
          <Text style={typography.titulo}>{clase.titulo}</Text>

          {/* Duración, cupos y horario */}
          <View style={[styles.datos, sombra]}>
            <View style={styles.dato}>
              <Ionicons name="time-outline" size={22} color={colors.primario} />
              <Text style={styles.datoValor}>{clase.duracion} min</Text>
              <Text style={styles.datoEtiqueta}>Duración</Text>
            </View>
            <View style={styles.dato}>
              <Ionicons name="people-outline" size={22} color={colors.primario} />
              <Text style={styles.datoValor}>{cuposMostrados}</Text>
              <Text style={styles.datoEtiqueta}>Cupos</Text>
            </View>
            <View style={styles.dato}>
              <Ionicons name="calendar-outline" size={22} color={colors.primario} />
              <Text style={styles.datoValor}>
                {reservada ? reserva.hora : `${totalHorarios} opciones`}
              </Text>
              <Text style={styles.datoEtiqueta}>
                {reservada ? reserva.dia : 'Horarios'}
              </Text>
            </View>
          </View>

          {/* Aviso de reserva con día y hora */}
          {reservada && (
            <View style={styles.avisoReservada}>
              <Ionicons name="checkmark-circle" size={22} color={colors.primario} />
              <View style={styles.avisoInfo}>
                <Text style={styles.avisoTitulo}>Clase reservada</Text>
                <Text style={styles.avisoTexto}>
                  {reserva.dia} a las {reserva.hora}
                </Text>
              </View>
            </View>
          )}

          {/* Profesor */}
          <View style={[styles.profesor, sombra]}>
            <Image
              source={{ uri: clase.profesor.foto }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.profesorEtiqueta}>Tu profesor</Text>
              <Text style={styles.profesorNombre}>{clase.profesor.nombre}</Text>
              <Text style={styles.profesorEtiqueta}>{clase.profesor.pais}</Text>
            </View>
          </View>

          {/* Descripción */}
          <View>
            <Text style={styles.subtitulo}>Acerca de la clase</Text>
            <Text style={styles.descripcion}>{clase.descripcion}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Toda la lógica de reservar/cancelar vive aquí */}
      <ReservaItem clase={clase} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  portada: { width: '100%', backgroundColor: colors.primarioSuave },
  contenido: {
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  badgeNivel: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarioSuave,
  },
  badgeTexto: { color: colors.primario, fontWeight: '700' },
  datos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  dato: { alignItems: 'center', gap: 2 },
  datoValor: { fontSize: 16, fontWeight: '800', color: colors.texto },
  datoEtiqueta: { fontSize: 12, color: colors.textoSuave },
  avisoReservada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primarioSuave,
  },
  avisoInfo: { gap: 2 },
  avisoTitulo: { fontSize: 12, fontWeight: '600', color: colors.primario },
  avisoTexto: { fontSize: 16, fontWeight: '800', color: colors.texto },
  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.borde,
  },
  profesorEtiqueta: { fontSize: 12, color: colors.textoSuave },
  profesorNombre: { fontSize: 15, fontWeight: '700', color: colors.texto },
  subtitulo: { fontSize: 18, fontWeight: '700', color: colors.texto },
  descripcion: {
    ...typography.cuerpo,
    color: colors.textoSuave,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});