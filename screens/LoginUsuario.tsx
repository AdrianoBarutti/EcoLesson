import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { auth } from "../src/services/firebaseConfig"; // O caminho é '../firebaseConfig' pois está dentro de 'screens'
import { signInWithEmailAndPassword } from "firebase/auth";

type RootStackParamList = {
  LoginUsuario: { mensagem?: string } | undefined;
  CadastrarUsuario: undefined;
  Home: undefined; 
};

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

      // O App.tsx irá detectar o usuário e redirecionar para 'Home'.
      // A navegação manual para 'Home' aqui é opcional mas não necessária
      // se o App.tsx estiver monitorando o estado.

    } catch (error: any) {
      let mensagem = "Credenciais inválidas. Verifique seu e-mail e senha.";
      
      if (error.code === "auth/invalid-email") {
        mensagem = "O formato do e-mail é inválido.";
      }
      
      Alert.alert("Erro de Login", mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Fazer Login</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />

      <Button
        title="Não tem conta? Cadastre-se"
        onPress={() => navigation.navigate("CadastrarUsuario")}
        disabled={loading}
      />
    </View>
  );
}