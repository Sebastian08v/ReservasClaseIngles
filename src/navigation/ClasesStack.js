import react from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClasesScreen from '../screens/ClasesScreen';
import {color} from '../theme';

const Stack = createNativeStackNavigator();

export default function ClasesStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = "Home"
                component = {ClasesScreen}
                options = {{header: false}}
            />
            <Stack.Screen
                name = "Detalle"
                component = {DetalleScreen}
                options = {{headerShown: false}}
            />
        </Stack.Navigator>
    )
}