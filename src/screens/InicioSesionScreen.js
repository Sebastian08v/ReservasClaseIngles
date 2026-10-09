import React, { useRef, useState } from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, Alert,KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography } from '../theme';
import { useAutenticacion } from '../hooks/useAutenticacion';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InicioSesionScreen({ navigation }) {
  const { iniciarSesion } = useAutenticacion();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const claveRef = useRef(null);

  const irARegistro = () => navigation.navigate('Registro', { email: email.trim() });

  const entrar = async () => {
    setError('');
    if (!EMAIL_RE.test(email.trim())) return setError('Ingresa un correo válido.');
    if (!clave) return setError('Ingresa tu contraseña.');

    setEnviando(true);
    try {
      const res = await iniciarSesion(email, clave);
      if (res.ok) return; // el navegador raíz cambia solo a la app

      if (res.motivo === 'no-registrado') {
        Alert.alert(
          'Aún no estás registrado',
          'No encontramos una cuenta con ese correo. Regístrate para continuar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Registrarme', onPress: irARegistro },
          ]
        );
      } else {
        setError('La contraseña es incorrecta.');
      }
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
          <Text style={styles.titulo}>Bienvenido</Text>
          <Text style={styles.subtitulo}>Inicia sesión para reservar tus clases de inglés</Text>

          <Text style={styles.label}>Correo</Text>
          <TextInput
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
          <View style={styles.claveFila}>
            <TextInput
              ref={claveRef}
              style={[styles.input, { flex: 1 }]}
              value={clave}
              onChangeText={setClave}
              placeholder="Tu contraseña"
              placeholderTextColor={colors.textoSuave}
              secureTextEntry={!verClave}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={entrar}
            />
            <Pressable onPress={() => setVerClave((v) => !v)} hitSlop={8} style={styles.ojo}>
              <Text style={styles.enlace}>{verClave ? 'Ocultar' : 'Ver'}</Text>
            </Pressable>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={[styles.boton, enviando && { opacity: 0.7 }]}
            onPress={entrar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botonTexto}>Iniciar sesión</Text>
            )}
          </Pressable>

          <View style={styles.pie}>
            <Text style={styles.subtitulo}>¿No tienes cuenta? </Text>
            <Pressable onPress={irARegistro} hitSlop={8}>
              <Text style={styles.enlace}>Regístrate</Text>
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
  label: { ...typography.cuerpo, color: colors.texto, fontWeight: '600', marginTop: 20, marginBottom: 6 },
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
  claveFila: { flexDirection: 'row', alignItems: 'center' },
  ojo: { position: 'absolute', right: 14 },
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