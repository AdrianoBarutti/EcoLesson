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

interface Vaga {
  id: number;
  titulo: string;
  descricao?: string;
  salario?: number;
  empresa?: string;
}

// Dados mockados de vagas - Salários entre R$ 2.400 e R$ 7.000
const vagasMockadas: Vaga[] = [
  {
    id: 1,
    titulo: "Desenvolvedor Full Stack Júnior",
    descricao: "Oportunidade para desenvolvedor iniciante ajudar projetos sociais com tecnologia. Buscamos profissional com conhecimento em React, Node.js e banco de dados. Trabalho remoto com horário flexível.",
    salario: 3500,
    empresa: "Tech Solutions",
  },
  {
    id: 2,
    titulo: "Analista de Energia Renovável",
    descricao: "Oportunidade para analista com conhecimento em energia solar e eólica. Ajudar comunidades com projetos sustentáveis. Experiência inicial aceita.",
    salario: 4200,
    empresa: "Green Energy Corp",
  },
  {
    id: 3,
    titulo: "Engenheiro de Eficiência Energética",
    descricao: "Oportunidade para engenheiro ajudar na otimização de consumo energético em comunidades. Experiência em auditorias energéticas desejável.",
    salario: 6800,
    empresa: "EcoTech Industries",
  },
  {
    id: 4,
    titulo: "Especialista em Gestão de Resíduos",
    descricao: "Oportunidade para especialista em gestão sustentável de resíduos. Ajudar comunidades com reciclagem e economia circular.",
    salario: 4500,
    empresa: "Sustentabilidade Plus",
  },
  {
    id: 5,
    titulo: "Consultor em Sustentabilidade",
    descricao: "Oportunidade para consultoria em práticas sustentáveis para ONGs e projetos sociais. Trabalho híbrido com flexibilidade.",
    salario: 5500,
    empresa: "EcoConsult",
  },
  {
    id: 6,
    titulo: "Assistente de Projetos Ambientais",
    descricao: "Vaga para assistente apoiar projetos ambientais e sociais. Ideal para quem está começando na área de sustentabilidade.",
    salario: 2400,
    empresa: "EcoTech Industries",
  },
  {
    id: 7,
    titulo: "Técnico em Energia Solar",
    descricao: "Oportunidade para técnico com conhecimento em instalação e manutenção de sistemas fotovoltaicos. Trabalho em campo.",
    salario: 3800,
    empresa: "Green Energy Corp",
  },
];

export default function Vagas() {
  const navigation = useNavigation();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento
    setTimeout(() => {
      setVagas(vagasMockadas);
      setLoading(false);
    }, 500);
  }, []);

  const renderVaga = ({ item }: { item: Vaga }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconBriefcase}>
              <View style={styles.iconBriefcaseTop} />
              <View style={styles.iconBriefcaseBody} />
            </View>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            {item.empresa && (
              <Text style={styles.empresa}>{item.empresa}</Text>
            )}
          </View>
        </View>
        {item.salario && (
          <View style={styles.salarioBadge}>
            <Text style={styles.salarioText}>
              R$ {item.salario.toLocaleString('pt-BR')}
            </Text>
          </View>
        )}
      </View>
      {item.descricao && (
        <Text style={styles.descricao} numberOfLines={3}>
          {item.descricao}
        </Text>
      )}
      <TouchableOpacity 
        style={styles.btnCandidatar} 
        activeOpacity={0.8}
        onPress={() => {
          Alert.alert(
            "Candidatura",
            `Você deseja se candidatar para a vaga "${item.titulo}"?`,
            [
              { text: "Cancelar", style: "cancel" },
              { 
                text: "Candidatar-se", 
                onPress: () => {
                  Alert.alert("Sucesso", "Candidatura enviada com sucesso!");
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.btnCandidatarText}>Candidatar-se →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Vagas Disponíveis</Text>
        <View style={{ width: 80 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#50C878" />
          <Text style={styles.loadingText}>Carregando vagas...</Text>
        </View>
      ) : vagas.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhuma vaga disponível</Text>
        </View>
      ) : (
        <FlatList
          data={vagas}
          renderItem={renderVaga}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#50C878",
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconBriefcase: {
    width: 30,
    height: 25,
    backgroundColor: "#50C878",
    borderRadius: 4,
    overflow: "hidden",
  },
  iconBriefcaseTop: {
    width: "60%",
    height: 5,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  iconBriefcaseBody: {
    flex: 1,
    backgroundColor: "#50C878",
    margin: 2,
    borderRadius: 2,
  },
  headerText: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2B4A",
    marginBottom: 6,
    lineHeight: 24,
  },
  empresa: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  salarioBadge: {
    backgroundColor: "#50C878",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 12,
  },
  salarioText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
    paddingLeft: 60,
  },
  btnCandidatar: {
    backgroundColor: "#50C878",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#50C878",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnCandidatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

