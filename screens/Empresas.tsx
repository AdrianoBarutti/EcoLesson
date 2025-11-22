import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Empresa {
  id: number;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  descricao?: string;
}

// Dados mockados de empresas
const empresasMockadas: Empresa[] = [
  {
    id: 1,
    nome: "Tech Solutions",
    razaoSocial: "Tech Solutions Tecnologia Ltda",
    cnpj: "12.345.678/0001-90",
    descricao: "Empresa líder em soluções tecnológicas sustentáveis, focada em inovação e responsabilidade ambiental.",
  },
  {
    id: 2,
    nome: "Green Energy Corp",
    razaoSocial: "Green Energy Corporation S.A.",
    cnpj: "23.456.789/0001-01",
    descricao: "Especializada em energia renovável, desenvolvendo projetos de energia solar e eólica em todo o Brasil.",
  },
  {
    id: 3,
    nome: "EcoTech Industries",
    razaoSocial: "EcoTech Indústrias Sustentáveis Ltda",
    cnpj: "34.567.890/0001-12",
    descricao: "Indústria comprometida com eficiência energética e práticas sustentáveis na produção.",
  },
  {
    id: 4,
    nome: "Sustentabilidade Plus",
    razaoSocial: "Sustentabilidade Plus Consultoria Ltda",
    cnpj: "45.678.901/0001-23",
    descricao: "Consultoria especializada em gestão de resíduos e implementação de práticas sustentáveis.",
  },
  {
    id: 5,
    nome: "EcoConsult",
    razaoSocial: "EcoConsult Assessoria Ambiental S.A.",
    cnpj: "56.789.012/0001-34",
    descricao: "Assessoria ambiental com foco em sustentabilidade corporativa e certificações verdes.",
  },
];

export default function Empresas() {
  const navigation = useNavigation();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEmpresas(empresasMockadas);
      setLoading(false);
    }, 500);
  }, []);

  const renderEmpresa = ({ item }: { item: Empresa }) => (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBuilding}>
            <View style={styles.iconBuildingTop} />
            <View style={styles.iconBuildingBody}>
              <View style={styles.iconBuildingWindow} />
              <View style={styles.iconBuildingWindow} />
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>
          {item.razaoSocial && (
            <Text style={styles.razaoSocial}>{item.razaoSocial}</Text>
          )}
        </View>
      </View>
      {item.descricao && (
        <Text style={styles.descricao} numberOfLines={3}>
          {item.descricao}
        </Text>
      )}
      {item.cnpj && (
        <Text style={styles.cnpj}>CNPJ: {item.cnpj}</Text>
      )}
      <TouchableOpacity 
        style={styles.btnVerVagas}
        onPress={() => {
          navigation.navigate("Vagas");
        }}
      >
        <Text style={styles.btnVerVagasText}>Ver Vagas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Empresas Parceiras</Text>
        <View style={{ width: 80 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFB347" />
          <Text style={styles.loadingText}>Carregando empresas...</Text>
        </View>
      ) : empresas.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhuma empresa cadastrada</Text>
        </View>
      ) : (
        <FlatList
          data={empresas}
          renderItem={renderEmpresa}
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
    backgroundColor: "#FFB347",
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
    color: "#1E2B4A",
    fontSize: 16,
    fontWeight: "600",
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E2B4A",
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
  headerCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFF8E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconBuilding: {
    width: 32,
    height: 24,
    position: "relative",
  },
  iconBuildingTop: {
    position: "absolute",
    top: 0,
    left: 6,
    width: 20,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 2,
  },
  iconBuildingBody: {
    position: "absolute",
    bottom: 0,
    left: 4,
    width: 24,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 4,
  },
  iconBuildingWindow: {
    width: 6,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 1,
    marginHorizontal: 2,
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2B4A",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  razaoSocial: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
    paddingLeft: 72,
  },
  cnpj: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
    paddingLeft: 72,
    fontFamily: "monospace",
  },
  btnVerVagas: {
    backgroundColor: "#FFB347",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FFB347",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnVerVagasText: {
    color: "#1E2B4A",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

