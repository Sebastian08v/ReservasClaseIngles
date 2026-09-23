import {Platform} from "react-native";

export const colors = {
    fondo: '#fefefe',
    primario: '#f78c40',
    texto: '#000303',
    borde: '#f29327',
    superficie: '#fefefe',
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

export const radius = {
    sm: 4,
    md: 8,
    lg: 12
}

export default {colors, spacing, typography, radius};