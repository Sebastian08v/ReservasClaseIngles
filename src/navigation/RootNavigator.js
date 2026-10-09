import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { useAutenticacion } from '../hooks/useAutenticacion';
import TabNavigator from './TabNavigator';
import InicioSesionScreen from '../screens/InicioSesionScreen';
import RegistroScreen from '../screens/RegistroScreen';
import ClasesStack from './ClasesStack';

const AutenticacionStack = createNativeStackNavigator();

function AutenticacionNavigator() {
  return (
    <AutenticacionStack.Navigator screenOptions={{ headerShown: false }}>
      <AutenticacionStack.Screen name="Login" component={InicioSesionScreen} />
      <AutenticacionStack.Screen name="Registro" component={RegistroScreen} />
    </AutenticacionStack.Navigator>
  );
}

export default function RootNavigator() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primario} />
      </View>
    );
  }

  return usuario ? <TabNavigator /> : <AutenticacionNavigator />;
}