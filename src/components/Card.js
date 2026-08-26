import React from 'react'
import {View, Text, Image, Pressable, StyleSheet } from 'react-native'
import EtiquetaNivel from './EtiquetaNivel'
import {spacing, colors, typography} from '../theme'
import { CLASES } from '../data/clases'

export default function Card ({clase, onPress}){
    return(
        <Pressable onPress={onPress}>
            <Image source={{uri: clase.Image}}/>
            <View>
                <EtiquetaNivel nivel= {clase.nivel}/>
                <Text> {clase.titulo} </Text>
                <Text> {clase.precio} </Text>
                <Text> {clase.profesor.nombre} </Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 16, 
        color: colors.texto
    }
})
