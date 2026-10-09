import React, { useState, useMemo } from 'react';
import {View,Text,TextInput,FlatList,ScrollView,Pressable,StyleSheet,} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import useResponsive from '../hooks/useResponsive';
import Card from '../components/Card';
import NivelFiltro from '../components/NivelFiltro';
import EstadoVacio from '../components/EstadoVacio';
import { normalizar } from '../components/EtiquetaNivel';
import { CLASES, NIVELES } from '../data/clases';
import { spacing, typography, colors, radius } from '../theme';

export default function ClasesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { columnas, paddingHorizontal } = useResponsive();

  const [nivel, setNivel] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const resultados = useMemo(() => {
    const textoBusqueda = normalizar(busqueda);
    return CLASES.filter((clase) => {
      const coincideNivel = nivel === 'Todos' || clase.nivel === nivel;
      const coincideTexto =
        textoBusqueda === '' ||
        normalizar(clase.titulo).includes(textoBusqueda) ||
        normalizar(clase.profesor.nombre).includes(textoBusqueda);

      return coincideNivel && coincideTexto;
    });
  }, [nivel, busqueda]);

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top + spacing.md }]}>
      {/* Encabezado */}
      <View style={[styles.encabezado, { paddingHorizontal }]}>
        <Text style={styles.saludo}>Aprende inglés a tu ritmo</Text>
        <Text style={typography.titulo}>Clases de inglés</Text>

        {/* Buscador */}
        <View style={styles.buscador}>
          <Ionicons name="search" size={18} color={colors.textoSuave} />
          <TextInput
            style={styles.input}
            placeholder="Buscar por clase o profesor"
            placeholderTextColor={colors.textoSuave}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
            returnKeyType="search"
          />
          {busqueda.length > 0 && (
            <Pressable onPress={() => setBusqueda('')} hitSlop={10}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textoSuave}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filtros de nivel: fila horizontal con scroll */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.filtros, { paddingHorizontal }]}
        >
          {NIVELES.map((item) => (
            <NivelFiltro
              key={item}
              etiqueta={item}
              activo={nivel === item}
              onPress={() => setNivel(item)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Contador de resultados */}
      <Text style={[styles.contador, { paddingHorizontal }]}>
        {resultados.length}{' '}
        {resultados.length === 1 ? 'clase disponible' : 'clases disponibles'}
      </Text>

      {/* Lista */}
      <FlatList
        style={styles.lista}
        data={resultados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card
            clase={item}
            onPress={() => navigation.navigate('DetalleClase', { clase: item })}
          />
        )}
        numColumns={columnas}
        key={columnas}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contenido,
          { paddingHorizontal, paddingBottom: insets.bottom + spacing.xl },
        ]}
        columnWrapperStyle={columnas > 1 ? styles.fila : undefined}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No se encontraron resultados"
            mensaje="Intenta con otro nivel o profesor"
            textoAccion="Limpiar búsqueda"
            onAction={() => {
              setNivel('Todos');
              setBusqueda('');
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  encabezado: { gap: spacing.xs },
  saludo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primario,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 50,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.texto,
    paddingVertical: 0,
  },
  filtros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  contador: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textoSuave,
    marginBottom: spacing.sm,
  },
  lista: { flex: 1 },
  contenido: {
    flexGrow: 1,
    paddingTop: spacing.xs,
  },
  fila: {
    gap: spacing.md,
  },
});