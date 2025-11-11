import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';



import { auth } from './src/services/firebaseConfig'; // CORRETO
import LoginUsuario from './screens/LoginUsuario';
import CadastrarUsuario from './screens/CadastrarUsuario';

// Crie um componente de Home simples para demonstração
const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Bem-vindo! Você está logado.</Text>
    <Text>ID do Usuário: {auth.currentUser?.uid}</Text>
  </View>
);

const Stack = createNativeStackNavigator();

// --- Pilhas de Navegação ---

// Telas visíveis quando o usuário ESTÁ logado
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tela Principal' }} />
    </Stack.Navigator>
  );
}

// Telas visíveis quando o usuário NÃO ESTÁ logado
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginUsuario" component={LoginUsuario} />
      <Stack.Screen name="CadastrarUsuario" component={CadastrarUsuario} />
    </Stack.Navigator>
  );
}

// --- Componente Principal de Roteamento ---
export default function App() {
  // O estado 'User' do Firebase é opcional (User | null)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Efeito para monitorar o estado de autenticação
  useEffect(() => {
    // onAuthStateChanged é o observador mais importante
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa o observador quando o componente for desmontado
    return unsubscribe;
  }, []);

  // Exibe tela de carregamento enquanto o Firebase inicializa
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={{ marginTop: 10 }}>Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Se houver um usuário, mostra o AppStack, senão, o AuthStack */}
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});