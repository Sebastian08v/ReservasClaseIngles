import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import{SafeAreaProvider} from 'react-native-safe-area-context';
import ReservasProvider from './src/contexts/ReservasContext';
import {AutenticacionProvider} from './src/contexts/AutenticacionContext';
import RootNavigator from './src/navigation/RootNavigator';
import {colors} from './src/theme';

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

export default function App() {
 
  return (
    <SafeAreaProvider>
      <AutenticacionProvider>
        <ReservasProvider>
          <NavigationContainer theme={temaNavegacion}>
            <RootNavigator />
          </NavigationContainer>
        </ReservasProvider>
      </AutenticacionProvider>
    </SafeAreaProvider>
  );
}
 