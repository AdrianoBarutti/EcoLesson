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

interface Certificado {
  id: number;
  cursoNome: string;
  dataEmissao: string;
  codigoValidacao: string;
}

// Dados mockados de certificados
const certificadosMockados: Certificado[] = [
  {
    id: 1,
    cursoNome: "Gestão de Parques Eólicos",
    dataEmissao: "2024-01-15",
    codigoValidacao: "CERT-2024-001-EL",
  },
  {
    id: 2,
    cursoNome: "Eficiência Energética Industrial",
    dataEmissao: "2024-02-20",
    codigoValidacao: "CERT-2024-002-EE",
  },
  {
    id: 3,
    cursoNome: "Introdução à Energia Solar",
    dataEmissao: "2024-03-10",
    codigoValidacao: "CERT-2024-003-SO",
  },
];

export default function Certificados() {
  const navigation = useNavigation();
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCertificados(certificadosMockados);
      setLoading(false);
    }, 500);
  }, []);

  const formatarData = (data: string) => {
    try {
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  };

  const renderCertificado = ({ item }: { item: Certificado }) => (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCertificate}>
            <View style={styles.iconCertificateTop} />
            <View style={styles.iconCertificateBody} />
            <View style={styles.iconCertificateSeal} />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.cursoNome}>
            {item.cursoNome}
          </Text>
          <Text style={styles.dataEmissao}>
            Emitido em: {formatarData(item.dataEmissao)}
          </Text>
        </View>
      </View>
      <View style={styles.codigoContainer}>
        <Text style={styles.codigoLabel}>Código de Validação:</Text>
        <Text style={styles.codigo}>{item.codigoValidacao}</Text>
      </View>
      <TouchableOpacity 
        style={styles.btnBaixar}
        onPress={() => {
          Alert.alert(
            "Baixar Certificado",
            `Deseja baixar o certificado do curso "${item.cursoNome}"?`,
            [
              { text: "Cancelar", style: "cancel" },
              { 
                text: "Baixar", 
                onPress: () => {
                  Alert.alert("Sucesso", "Certificado baixado com sucesso!");
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.btnBaixarText}>Baixar Certificado</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Meus Certificados</Text>
        <View style={{ width: 80 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E74C3C" />
          <Text style={styles.loadingText}>Carregando certificados...</Text>
        </View>
      ) : certificados.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconContainer}>
            <View style={styles.emptyIconCertificate}>
              <View style={styles.emptyIconTop} />
              <View style={styles.emptyIconBody} />
              <View style={styles.emptyIconSeal} />
            </View>
          </View>
          <Text style={styles.emptyText}>Você ainda não possui certificados</Text>
          <Text style={styles.emptySubtext}>
            Complete cursos para receber certificados
          </Text>
        </View>
      ) : (
        <FlatList
          data={certificados}
          renderItem={renderCertificado}
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
    backgroundColor: "#E74C3C",
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  emptyIconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconCertificate: {
    width: 80,
    height: 60,
    position: "relative",
  },
  emptyIconTop: {
    width: 60,
    height: 8,
    backgroundColor: "#E74C3C",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 4,
    opacity: 0.3,
  },
  emptyIconBody: {
    width: 70,
    height: 40,
    backgroundColor: "#E74C3C",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E74C3C",
    alignSelf: "center",
    opacity: 0.2,
  },
  emptyIconSeal: {
    position: "absolute",
    right: 10,
    bottom: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E74C3C",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
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
    backgroundColor: "#FEE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconCertificate: {
    width: 32,
    height: 24,
    position: "relative",
  },
  iconCertificateTop: {
    width: 24,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 2,
  },
  iconCertificateBody: {
    width: 28,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    alignSelf: "center",
  },
  iconCertificateSeal: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  infoContainer: {
    flex: 1,
  },
  cursoNome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2B4A",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  dataEmissao: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  codigoContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  codigoLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codigo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E74C3C",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  btnBaixar: {
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnBaixarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

