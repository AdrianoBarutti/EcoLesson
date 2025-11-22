import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// URL da sua API - confirmada como funcionando
// No Expo Web, localhost funciona normalmente
// No dispositivo físico, use o IP da sua máquina
const API_URL = "http://localhost:5030/api/v1/cursos";

// Interface baseada na estrutura real da API
interface CursoAPI {
  idCurso: number;
  nomeCurso: string;
  descricao?: string;
  qtHoras?: number;
  links?: any;
}

interface Curso {
  id: number;
  nome: string;
  descricao?: string;
  horas?: number;
}

export default function Cursos() {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}?page=1&pageSize=20`;
      console.log("🔵 Carregando cursos de:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log("🟢 Status da resposta:", response.status);
      console.log("🟢 Headers:", JSON.stringify([...response.headers.entries()]));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 Erro na resposta:", errorText);
        throw new Error(`Erro ${response.status}: ${response.statusText}\n${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      console.log("🟢 Dados recebidos (raw):", JSON.stringify(data).substring(0, 500));
      
      // A API retorna { data: [...], page: 1, ... }
      const cursosAPI: CursoAPI[] = data.data || [];
      console.log("🟢 Cursos da API:", cursosAPI.length);
      
      if (cursosAPI.length === 0) {
        console.warn("⚠️ Array de cursos está vazio!");
        // Tenta usar a resposta direta se não tiver campo data
        if (Array.isArray(data)) {
          console.log("🟢 Resposta é um array direto");
          const cursosList: Curso[] = data.map((curso: any) => ({
            id: curso.idCurso || curso.id,
            nome: curso.nomeCurso || curso.nome,
            descricao: curso.descricao,
            horas: curso.qtHoras || curso.duracaoHoras || curso.horas,
          }));
          setCursos(cursosList);
          return;
        }
      }
      
      // Converter da estrutura da API para a estrutura da interface
      const cursosList: Curso[] = cursosAPI
        .map((curso) => ({
          id: curso.idCurso,
          nome: curso.nomeCurso,
          descricao: curso.descricao,
          horas: curso.qtHoras,
        }))
        .filter((curso) => {
          // Filtrar cursos com nome inválido, vazio ou "string"
          return curso.nome && 
                 curso.nome.trim() !== "" && 
                 curso.nome.toLowerCase() !== "string";
        });
      
      console.log("✅ Cursos processados:", cursosList.length);
      console.log("✅ Primeiro curso:", cursosList[0]);
      setCursos(cursosList);
    } catch (error: any) {
      console.error("🔴 Erro completo ao carregar cursos:", error);
      console.error("🔴 Stack:", error.stack);
      
      let mensagemErro = "Não foi possível carregar os cursos.";
      if (error.message) {
        mensagemErro += `\n\n${error.message}`;
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        mensagemErro += "\n\nVerifique se a API está rodando e acessível.";
      }
      
      Alert.alert("Erro ao carregar cursos", mensagemErro);
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar número aleatório de vídeos baseado no ID (para ser consistente)
  const getNumeroVideos = (cursoId: number): number => {
    // Usa o ID como seed para gerar um número "aleatório" mas consistente
    const seed = cursoId * 7 + 13;
    return (seed % 26) + 5; // Número entre 5 e 30
  };

  const renderCurso = ({ item }: { item: Curso }) => {
    const numeroVideos = getNumeroVideos(item.id);
    
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardTopSection}>
          <View style={styles.iconContainer}>
            <View style={styles.iconGrid}>
              <View style={styles.iconRow}>
                <View style={styles.iconBox} />
                <View style={styles.iconBox} />
              </View>
              <View style={styles.iconRow}>
                <View style={styles.iconBox} />
                <View style={styles.iconBox} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardBottomSection}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.nome || "Curso sem nome"}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              <View style={styles.playIcon}>
                <View style={styles.playTriangle} />
              </View>
              <Text style={styles.videoCount}>
                {numeroVideos}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.footerRight}>
              <Text style={styles.hourCount}>
                {item.horas ? `${item.horas}h` : "0h"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Cursos Disponíveis</Text>
        <View style={{ width: 80 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2E86C1" />
          <Text style={styles.loadingText}>Carregando cursos...</Text>
        </View>
      ) : cursos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhum curso disponível</Text>
          <Text style={styles.emptySubtext}>
            Verifique se a API está rodando em: {API_URL}
          </Text>
          <TouchableOpacity onPress={carregarCursos} style={styles.btnRecarregar}>
            <Text style={styles.btnRecarregarText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cursos}
          renderItem={renderCurso}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: "#6C757D",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E2B4A",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  list: {
    padding: 16,
    paddingTop: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "48%",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  cardTopSection: {
    backgroundColor: "#1E2B4A",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  iconGrid: {
    width: 56,
    height: 56,
    justifyContent: "space-between",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBox: {
    width: 24,
    height: 24,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    borderRadius: 4,
  },
  cardBottomSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    minHeight: 100,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2B4A",
    marginBottom: 12,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  playIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1E2B4A",
    justifyContent: "center",
    alignItems: "center",
  },
  playTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: "#FFFFFF",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: 2,
  },
  videoCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2B4A",
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: "#DEE2E6",
    marginHorizontal: 12,
  },
  hourCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2B4A",
  },
  btnRecarregar: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: "#1E2B4A",
    borderRadius: 12,
    shadowColor: "#1E2B4A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnRecarregarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
