import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, // Usaremos TouchableOpacity para o botão "Entrar" estilizado
  Alert, 
  StyleSheet, 
  Image, 
  ActivityIndicator // Para o indicador de loading
} from "react-native";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { auth } from "../src/services/firebaseConfig"; 
import { signInWithEmailAndPassword } from "firebase/auth";

// Tipagem de navegação
type RootStackParamList = {
  LoginUsuario: { mensagem?: string } | undefined;
  CadastrarUsuario: undefined;
  Home: undefined; 
};

// Componente do Ícone (simulando o "EL" em um círculo)
const LogoIcon = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>EL</Text>
  </View>
);

export default function LoginUsuario() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LoginUsuario'>>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(route.params?.mensagem || '');

  useEffect(() => {
    if (successMessage) {
      Alert.alert("Sucesso", successMessage);
      navigation.setParams({ mensagem: undefined });
      setSuccessMessage('');
    }
  }, [successMessage, navigation]);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      // 🚨 FUNÇÃO PRINCIPAL DE LOGIN DO FIREBASE 🚨
      await signInWithEmailAndPassword(auth, email, senha);

      // A navegação será tratada pelo App.tsx (AuthState Listener)

    } catch (error: any) {
      let mensagem = "Credenciais inválidas. Verifique seu e-mail e senha.";
      
      if (error.code === "auth/invalid-email") {
        mensagem = "O formato do e-mail é inválido.";
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        mensagem = "Credenciais inválidas. Verifique seu e-mail e senha.";
      }
      
      Alert.alert("Erro de Login", mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    // View principal para o background azul escuro
    <View style={styles.container}>
      
      {/* Container branco centralizado (o "cartão" de login) */}
      <View style={styles.loginCard}>
        
        <LogoIcon />
        <Text style={styles.title}>EcoLesson</Text>

        {/* Campo de Usuário (E-mail) */}
        <Text style={styles.label}>Usuário:</Text>
        <TextInput
          placeholder="" // Deixamos vazio para simular o layout da imagem
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        
        {/* Campo de Senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          placeholder="" // Deixamos vazio para simular o layout da imagem
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        {/* Botão de Entrar (TouchableOpacity para estilizar o fundo) */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" /> // Indicador branco de loading
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
        
        {/* Botão de Cadastro (removido do layout da imagem, mas mantido como texto simples) */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("CadastrarUsuario")}
          disabled={loading}
        >
            <Text style={styles.registerLinkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

// Definição dos Estilos
const styles = StyleSheet.create({
  // Fundo Azul Escuro
  container: {
    flex: 1,
    backgroundColor: '#1E2B4A', // Cor de fundo azul escuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  // O "Cartão" de Login Branco
  loginCard: {
    width: '85%', // Ocupa boa parte da largura
    maxWidth: 400, // Limita o tamanho em telas maiores
    backgroundColor: '#FFFFFF', // Fundo branco
    borderRadius: 8,
    padding: 30,
    alignItems: 'stretch', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  logoContainer: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E86C1', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
    marginTop: 10,
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#FAFAFA', 
  },
 
  loginButton: {
    backgroundColor: '#333333', 
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Link de Cadastro
  registerLink: {
    marginTop: 15,
    alignSelf: 'center',
  },
  registerLinkText: {
    color: '#2E86C1', 
    fontSize: 14,
  }
});