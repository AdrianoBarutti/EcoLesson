import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { signOut, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";

export default function Perfil() {
  const navigation = useNavigation();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(auth.currentUser?.displayName || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Monitora mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && isLoggingOut) {
        // Usuário foi deslogado, não precisa fazer nada
        // o App.tsx já vai redirecionar automaticamente
        setIsLoggingOut(false);
      }
    });

    return () => unsubscribe();
  }, [isLoggingOut]);

  const handleSalvar = async () => {
    if (!auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, { displayName: nome });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setEditando(false);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  const handleLogout = async () => {
    console.log("=== handleLogout CHAMADO ===");
    
    try {
      setIsLoggingOut(true);
      console.log("Estado isLoggingOut definido como true");
      
      if (!auth.currentUser) {
        console.log("❌ Nenhum usuário logado");
        Alert.alert("Aviso", "Nenhum usuário logado.");
        setIsLoggingOut(false);
        return;
      }
      
      const userEmail = auth.currentUser.email;
      const userUID = auth.currentUser.uid;
      console.log("✅ Usuário encontrado:", userEmail);
      console.log("✅ UID:", userUID);
      
      console.log("Chamando signOut(auth)...");
      await signOut(auth);
      console.log("✅ signOut(auth) concluído sem erros");
      
      // Verifica imediatamente
      console.log("Verificando auth.currentUser após signOut:", auth.currentUser);
      
      // Aguarda um pouco para o Firebase processar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const checkAfterDelay = auth.currentUser;
      console.log("Verificação após 500ms:", checkAfterDelay);
      
      if (checkAfterDelay) {
        console.error("❌ PROBLEMA: Usuário ainda está logado após signOut!");
        setIsLoggingOut(false);
        Alert.alert("Erro", "Não foi possível fazer logout. Por favor, feche e reabra o aplicativo.");
      } else {
        console.log("✅ SUCESSO: Usuário é null após signOut");
        // O onAuthStateChanged no App.tsx deve redirecionar automaticamente
      }
      
    } catch (error: any) {
      console.error("❌ ERRO CAPTURADO no handleLogout:");
      console.error("Tipo do erro:", typeof error);
      console.error("Erro completo:", error);
      console.error("Código do erro:", error?.code);
      console.error("Mensagem do erro:", error?.message);
      console.error("Stack:", error?.stack);
      
      setIsLoggingOut(false);
      Alert.alert("Erro", `Não foi possível fazer logout: ${error?.message || "Erro desconhecido"}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Meu Perfil</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {auth.currentUser?.displayName?.charAt(0).toUpperCase() || 
               auth.currentUser?.email?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nome</Text>
          {editando ? (
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
            />
          ) : (
            <Text style={styles.value}>
              {auth.currentUser?.displayName || "Não informado"}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{auth.currentUser?.email || "Não informado"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>ID do Usuário</Text>
          <Text style={[styles.value, styles.idText]}>
            {auth.currentUser?.uid || "Não disponível"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {editando ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnSalvar]}
                onPress={handleSalvar}
              >
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancelar]}
                onPress={() => {
                  setNome(auth.currentUser?.displayName || "");
                  setEditando(false);
                }}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.btnEditar]}
              onPress={() => setEditando(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btn, styles.btnLogout, isLoggingOut && styles.btnDisabled]}
            onPress={async () => {
              if (isLoggingOut) {
                console.log("Logout já em andamento, ignorando...");
                return;
              }
              
              console.log("Botão Sair pressionado");
              
              // Usa uma abordagem mais direta - chama o logout sem Alert primeiro para testar
              // Se funcionar, depois podemos adicionar o Alert de volta
              try {
                console.log("Chamando handleLogout diretamente...");
                await handleLogout();
              } catch (error) {
                console.error("Erro ao chamar handleLogout:", error);
              }
              
              // Versão com Alert (comentada temporariamente para debug)
              /*
              Alert.alert(
                "Sair",
                "Deseja realmente sair?",
                [
                  { 
                    text: "Cancelar", 
                    style: "cancel",
                    onPress: () => {
                      console.log("Logout cancelado pelo usuário");
                    }
                  },
                  { 
                    text: "Sair", 
                    onPress: async () => {
                      console.log("Usuário confirmou logout no Alert");
                      try {
                        await handleLogout();
                      } catch (error) {
                        console.error("Erro ao executar handleLogout do Alert:", error);
                      }
                    }, 
                    style: "destructive" 
                  }
                ],
                { cancelable: true }
              );
              */
            }}
            activeOpacity={0.8}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>Sair</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1E2B4A",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  btnVoltar: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnVoltarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1E2B4A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1E2B4A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  idText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#999",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  btn: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnEditar: {
    backgroundColor: "#1E2B4A",
    shadowColor: "#1E2B4A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSalvar: {
    backgroundColor: "#50C878",
    shadowColor: "#50C878",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnCancelar: {
    backgroundColor: "#6c757d",
  },
  btnLogout: {
    backgroundColor: "#E74C3C",
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

