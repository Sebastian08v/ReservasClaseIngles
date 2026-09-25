import { useContext } from "react";
import { ReservasContext } from "../contexts/ReservasContext";

export default function useReserva(){
    const contexto = useContext(ReservasContext);
    if (!contexto) {
        throw new Error('useReserva debe usarse dentro de <ReservasProvider>');
    };
    return contexto;
};  
