import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAlmacenamiento(clave, valorInicial){
    const [valor, setValor] = useState(valorInicial);
    const [listo, setListo] = useState(false);

    useEffect(()=>{   
        let activo = true; //bandera para saber si estoy guardando el componente o montando el componente
        
        AsyncStorage.getItem(clave)
        .then((guardando)=>{
            if (activo && guardando !== null) setValor(JSON.parse(guardando))
        })
        .catch((error)=>
            console.log('error leyendo'+ clave, valor)
        )
        .finally(()=> activo && setListo(true));

        return()=>{
            activo = false;
        }
    },[clave])

    const actualizar = useCallback(
        async(nuevoValor)=>{
            setValor(nuevoValor);
            try{
                await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
            }catch(error){
                console.log('Error guardando' + clave, error)
            }
        }, [clave]
    );

    const eliminar = useCallback(
        async (valor)=>{
            
        }
    )
};
