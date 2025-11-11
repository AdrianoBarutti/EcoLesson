// screens/CadastrarUsuario.tsx

import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { auth } from "../src/services/firebaseConfig"; // O caminho é '../firebaseConfig' pois está dentro de 'screens'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Define os parâmetros de navegação para as telas que serão usadas
type RootStackParamList = {
  LoginUsuario: { mensagem?: string } | undefined;
  // A tela Home não precisa ser definida aqui, mas é bom tê-la no App.tsx
};

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
      
      // 🚨 2. ATUALIZAÇÃO DO PERFIL: Adiciona o nome de exibição (opcional, mas recomendado)
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
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Cadastre-se</Text>

      <TextInput 
        placeholder="Nome Completo" 
        value={nome} 
        onChangeText={setNome} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} 
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha (mín. 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleCadastro}
        disabled={loading}
      />
      
      <View style={{ marginTop: 10 }}>
        <Button
          title="Já tenho conta? Fazer Login"
          onPress={() => navigation.navigate("LoginUsuario")}
          disabled={loading}
          color="#3498db" // Cor diferente para o botão secundário
        />
      </View>
    </View>
  );
}