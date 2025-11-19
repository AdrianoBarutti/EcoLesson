// screens/CadastrarUsuario.tsx

import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, // Usaremos para estilizar os botões
  Alert, 
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { auth } from "../src/services/firebaseConfig"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Define os parâmetros de navegação para as telas que serão usadas
type RootStackParamList = {
  LoginUsuario: { mensagem?: string } | undefined;
  // A tela Home não precisa ser definida aqui, mas é bom tê-la no App.tsx
};

// Componente do Ícone (simulando o "EL" em um círculo)
const LogoIcon = () => (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>EL</Text>
    </View>
);


export default function CadastrarUsuario() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 🚨 1. FUNÇÃO PRINCIPAL: Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      // 🚨 2. ATUALIZAÇÃO DO PERFIL: Adiciona o nome de exibição 
      await updateProfile(userCredential.user, { displayName: nome });

      // 3. Navega para a tela de Login com uma mensagem de sucesso
      navigation.navigate("LoginUsuario", { mensagem: "Cadastro realizado com sucesso! Faça seu login." });

    } catch (error: any) {
      let mensagem = "Erro durante o cadastro. Tente novamente.";
      
      // Tratamento de erros comuns do Firebase Auth
      if (error.code === "auth/email-already-in-use") mensagem = "Este e-mail já está em uso.";
      else if (error.code === "auth/invalid-email") mensagem = "O formato do e-mail é inválido.";
      else if (error.code === "auth/weak-password") mensagem = "A senha deve ter pelo menos 6 caracteres.";
      
      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    // View principal para o background azul escuro
    <View style={styles.container}>
      
      {/* Container branco centralizado (o "cartão" de cadastro) */}
      <View style={styles.loginCard}>
        
        <LogoIcon />
        <Text style={styles.title}>Cadastre-se no EcoLesson</Text>
        
        {/* Campo Nome */}
        <Text style={styles.label}>Nome Completo:</Text>
        <TextInput 
          placeholder="" 
          value={nome} 
          onChangeText={setNome} 
          style={styles.input} 
        />
        
        {/* Campo E-mail */}
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          placeholder=""
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        
        {/* Campo Senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          placeholder=""
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        {/* Botão de Cadastro */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
        
        {/* Link para Fazer Login */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("LoginUsuario")}
          disabled={loading}
        >
            <Text style={styles.loginLinkText}>Já tenho conta? Fazer Login</Text>
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
    // O "Cartão" de Cadastro Branco
    loginCard: {
        width: '85%', 
        maxWidth: 400, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 8,
        padding: 30,
        alignItems: 'stretch', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // Estilo para o ícone "EL"
    logoContainer: {
        alignSelf: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2E86C1', // Azul 
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
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 5,
        marginTop: 5,
    },
    // Estilo dos campos de input
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 10,
        borderRadius: 4,
        marginBottom: 15,
        backgroundColor: '#FAFAFA', 
    },
    // Estilo do botão Cadastrar (Principal)
    registerButton: {
        backgroundColor: '#3498db', // Cor azul para o botão principal
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
    // Link de Login (Secundário)
    loginLink: {
        marginTop: 15,
        alignSelf: 'center',
    },
    loginLinkText: {
        color: '#555555', // Cor cinza mais discreta
        fontSize: 14,
    }
});