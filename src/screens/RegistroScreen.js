import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography } from '../theme';
import { useAutenticacion } from '../hooks/useAutenticacion';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistroScreen({ navigation, route }) {
  const { registrar } = useAutenticacion();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState(route.params?.email ?? ''); // viene del login si lo escribió
  const [clave, setClave] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const emailRef = useRef(null);
  const claveRef = useRef(null);
  const confirmarRef = useRef(null);

  const crearCuenta = async () => {
    setError('');
    if (nombre.trim().length < 2) return setError('Ingresa tu nombre.');
    if (!EMAIL_RE.test(email.trim())) return setError('Ingresa un correo válido.');
    if (clave.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (clave !== confirmar) return setError('Las contraseñas no coinciden.');

    setEnviando(true);
    try {
      const res = await registrar({ nombre, email, clave });
      if (res.ok) return; // sesión iniciada: el navegador raíz entra a la app

      Alert.alert('Ya tienes cuenta', 'Ese correo ya está registrado. Inicia sesión.', [
        { text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Regístrate para reservar tus clases de inglés</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
            placeholderTextColor={colors.textoSuave}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <Text style={styles.label}>Correo</Text>
          <TextInput
            ref={emailRef}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            placeholderTextColor={colors.textoSuave}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => claveRef.current?.focus()}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            ref={claveRef}
            style={styles.input}
            value={clave}
            onChangeText={setClave}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textoSuave}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => confirmarRef.current?.focus()}
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            ref={confirmarRef}
            style={styles.input}
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="Repite tu contraseña"
            placeholderTextColor={colors.textoSuave}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={crearCuenta}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={[styles.boton, enviando && { opacity: 0.7 }]}
            onPress={crearCuenta}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botonTexto}>Registrarme</Text>
            )}
          </Pressable>

          <View style={styles.pie}>
            <Text style={styles.subtitulo}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
              <Text style={styles.enlace}>Inicia sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.superficie },
  contenido: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  titulo: { ...typography.cuerpo, fontSize: 28, fontWeight: '700', color: colors.texto, marginBottom: 4 },
  subtitulo: { ...typography.cuerpo, color: colors.textoSuave },
  label: { ...typography.cuerpo, color: colors.texto, fontWeight: '600', marginTop: 18, marginBottom: 6 },
  input: {
    ...typography.cuerpo,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.texto,
    backgroundColor: colors.superficie,
  },
  enlace: { ...typography.cuerpo, color: colors.primario, fontWeight: '600' },
  error: { ...typography.cuerpo, color: '#D93025', marginTop: 12 },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  botonTexto: { ...typography.cuerpo, color: '#fff', fontWeight: '700' },
  pie: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});