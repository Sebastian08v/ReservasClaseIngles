import react from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClasesScreen from '../screens/ClasesScreen';
import DetalleClase from '../screens/DetalleClase';
import {colors} from '../theme';

const Stack = createNativeStackNavigator();

export default function ClasesStack(){
    return(
        
        <Stack.Navigator>
            <Stack.Screen
                name = "Home"
                component = {ClasesScreen}
                options = {{headerShown: false}}
            />

            <Stack.Screen
                name = "DetalleClase"
                component = {DetalleClase}
                options = {{title: 'Detalle', headerBackTitle: 'Atras'}}
            />
        </Stack.Navigator>

        
    )
}