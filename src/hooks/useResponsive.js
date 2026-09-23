import { useWindowDimensions } from "react-native";

export default function useResponsive() {
    const { width, heigth} = useWindowDimensions();

    const isTable = width >= 768;
    const isHorizontal = width > heigth;

    return {
        width,
        heigth,
        isTable,
        isHorizontal,
        columnas: isTable ? 2 : 1,
        ancho: isTable ? 320 : Math.min(width*0.72, 300),
        paddingHorizontal: isTable ? 32 : 16
    };
}