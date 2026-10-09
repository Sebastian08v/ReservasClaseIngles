import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ClasesStack from './ClasesStack';
import MisReservasScreen from '../screens/MisReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

const ICONOS = {
  ClasesTab: ['book', 'book-outline'],
  ReservasTab: ['calendar', 'calendar-outline'],
  PerfilTab: ['person', 'person-outline'],
};

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.textoSuave,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.superficie,
          borderTopColor: colors.borde,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom || 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const [activo, inactivo] = ICONOS[route.name];
          return <Ionicons name={focused ? activo : inactivo} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ClasesTab"
        component={ClasesStack}
        options={({ route }) => {
          // Oculta la barra en el detalle para que no choque con tu barra fija de "Reservar"
          const ruta = getFocusedRouteNameFromRoute(route) ?? 'Clases';
          return {
            title: 'Clases',
            headerShown: false, // el header lo maneja el stack
            tabBarStyle: ruta === 'DetalleClase' ? { display: 'none' } : undefined,
          };
        }}
      />
      <Tab.Screen
        name="ReservasTab"
        component={MisReservasScreen}
        options={{ title: 'Mis reservas', headerTitle: 'Mis reservas' }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{ title: 'Usuario', headerTitle: 'Mi perfil' }}
      />
    </Tab.Navigator>
  );
}