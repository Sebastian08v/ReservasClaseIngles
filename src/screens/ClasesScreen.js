import React, {useState} from 'react';
import {View, Text, TextInput, FlatList, ScrollView, StyleSheet} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import Card from '../components/Card';
import {CLASES, NIVELES} from '../data/clases';

export default function ClasesScreen ({navigation}) {
     //const {columnas, paddingHorizontal} = useResponsive();
    const[nivel, setNivel] = useState(''); 
  return(
    <View>
        <View>
            <Text> Aplicacion clases de ingles</Text>
            <View>
                <Ionicons name = "search" size = {18}/>
                <TextInput 
                    placeholder = "Buscar por nivel o profesor"
                    value= {nivel}
                    onChangeText={setNivel}
                    autoCorrect={false}
                />
            </View>
        </View>
    </View>
  )
}
