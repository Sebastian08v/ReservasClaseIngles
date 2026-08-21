import {Platform} from "react-native";

export const colors = {
    fondo: '#F6F7FB',
    primario: '#4f46e5',
    texto: '#111827',
    borde: '#e5e7eb'
};

export const spacing ={
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20
}

export const typography ={
    titulo: {fontSize: 26, fontWeight: '800', color: colors.texto},
    subtitulo:{fontSize: 18, fontWeight: '600', color: colors.texto}
}

export default {colors, spacing, typography}