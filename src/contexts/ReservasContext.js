import  React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_RESERVAS = 'reservas';

export const ReservasContext = createContext(null);

export default function ReservasProvider({ children }) {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        const cargar = async ()=>{
            try{
                const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
                if(guardado !== null){
                    setReservas(JSON.parse(guardado))
                }
            }catch(error){
                console.log('error leyendo las reservas: ', error);
            }finally{
                setCargando(false);
            }
        };
        cargar();
        if (cargando) return;
        AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)).catch((error)=>
            console.log('Error al guardar reservas', error)
        );
    },[reservas, cargando]);

    const agregarReserva = useCallback((clase, horario) => {
        const nueva={
            id: clase.id + '_' + horario,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre + ' ' + clase.profesor.apellido,
            precio: clase.precio,
            horario,
            creadaEn: new Date().toISOString()
        };
        let resultados = {ok: true};
        setReservas((previa)=>{
            if (previa.some((r)=>r.id ===nueva.id)){
                resultados = {ok: false, mensaje: 'Data duplicada'}
                return previa;
            }
            return [nueva, ...previa];
        });
        return resultados;
    }, []);

    const valor = useMemo(() => ({
        reservas,
        cargando,
        agregarReserva, 
        cancelarReserva,
        actualizarReserva
    }), [reservas, cargando, agregarReserva, cancelarReserva, actualizarReserva]);

    return <ReservasContext.Provider value={valor}> {children} </ReservasContext.Provider>
}