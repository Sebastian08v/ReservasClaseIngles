import React, {useState, useMemo} from 'react';
import {View, Text, TextInput, FlatList, ScrollView, StyleSheet} from 'react-native';
import { useSafeAreaInsets} from 'react-native-safe-area-context';

import {Ionicons} from '@expo/vector-icons';

import useResponsive from '../hooks/useResponsive';
import Card from '../components/Card';
import NivelFiltro from '../components/NivelFiltro';
import {CLASES, NIVELES} from '../data/clases';
import { spacing, typography, colors, radius } from '../theme';
import EstadoVacio from '../components/EstadoVacio';


export default function ClasesScreen ({navigation}) {
    const insets = useSafeAreaInsets();
    const {columnas, paddingHorizontal} = useResponsive();

    const[nivel, setNivel] = useState(''); 
    const[busqueda, setBusqueda] = useState('');

    const resultados = useMemo(() => {
        const textoBusqueda = busqueda.trim().toLowerCase();
        return CLASES.filter((clase)=>{
            const coincideNivel = nivel === 'Todos' || clase.nivel === nivel;
            const coincideTextoBusqueda = textoBusqueda === '' || 
            clase.titulo.toLowerCase().includes(textoBusqueda) ||
            clase.profesor.nombre.toLowerCase().includes(textoBusqueda);
            return coincideNivel && coincideTextoBusqueda
        })
    },[nivel, busqueda]);

  return(
    
    <View style={[style.pantalla, {paddingTop: insets.top + spacing.md}]}>
        <View style = {{paddingHorizontal: spacing.lg}}>
            <Text style = {typography.titulo}>Aplicacion clases de ingles</Text>
            <View style = {style.buscador}>
                <Ionicons name = "search" size = {18}/>
                <TextInput 
                    placeholder = "Buscar por nivel o profesor"
                    value= {nivel}
                    onChangeText={setNivel}
                    autoCorrect={false}
                />
                {busqueda.length > 0 &&(
                    <Ionicons
                        name="close-circle"
                        size={18}
                        onPress={() => setBusqueda('')}
                    />
                )}    
            </View>
            <ScrollView 
                style = {{flexGrow: 0}}
            >
            {/*repasar metodo .mas de js*/}
            {
                NIVELES.map((item)=>(
                    <NivelFiltro
                        key={item}
                        etiqueta={item}
                        activo={nivel === item}
                        onPress={() => setNivel(item)}
                    />
                ))
            }
            </ScrollView>

            <FlatList
                data={resultados}
                keyExtractor={(item) => item.id}
                renderItem={({item})=>(
                    <Card
                        clase={item}
                        onPress={()=> navigation.navigate('DetalleClase', {clase: item})}
                    />
                )}
                numColumns={columnas}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal, 
                    flexGrow: 1,
                    paddingBottom: spacing.xl
                }}
                ListEmptyComponent={
                    <EstadoVacio
                        icono="search-outline"
                        titulo="No se encontraron resultados"
                        mensaje="Intenta con otro nivel o profesor"
                        textoAccion="Limpiar busqueda"
                        onAction={() => {
                            setNivel('Todos');
                            setBusqueda('');}
                        }
                    />
                }
            />
        </View>
    </View>
    
  )
}

const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});
