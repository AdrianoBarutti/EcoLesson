import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { buildInfo as initialBuildInfo } from "../src/config/buildInfo";

export default function SobreApp() {
  const navigation = useNavigation();
  const [info, setInfo] = useState(initialBuildInfo);

  // Recarrega automaticamente quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      // Remove o cache do módulo e recarrega
      try {
        delete require.cache[require.resolve('../src/config/buildInfo')];
        const freshInfo = require('../src/config/buildInfo').buildInfo;
        setInfo(freshInfo);
      } catch (e) {
        // Se houver erro, mantém os valores iniciais
        setInfo(initialBuildInfo);
      }
    }, [])
  );

  // Também recarrega quando o componente monta
  useEffect(() => {
    try {
      delete require.cache[require.resolve('../src/config/buildInfo')];
      const freshInfo = require('../src/config/buildInfo').buildInfo;
      setInfo(freshInfo);
    } catch (e) {
      setInfo(initialBuildInfo);
    }
  }, []);

  const formatCommitHash = (hash: string) => {
    if (!hash || hash.length < 7) return hash || 'N/A';
    return hash.substring(0, 7);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.btnVoltar}
        >
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Sobre o App</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>EL</Text>
          </View>
          <Text style={styles.appName}>{info.appName}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Versão</Text>
            <Text style={styles.infoValue}>{info.version}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Hash do Commit</Text>
            <View style={styles.commitContainer}>
              <Text style={styles.commitHash}>{formatCommitHash(info.commitHash)}</Text>
            </View>
            <Text style={styles.commitFull}>
              {info.commitHash}
            </Text>
          </View>

          <View style={[styles.infoItem, styles.lastInfoItem]}>
            <Text style={styles.infoLabel}>Data do Build</Text>
            <Text style={styles.infoValue}>
              {new Date(info.buildDate).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Sobre</Text>
          <Text style={styles.descriptionText}>
            O EcoLesson é uma plataforma educacional focada em cursos, vagas, 
            empresas e certificados relacionados à educação e sustentabilidade.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 EcoLesson. Todos os direitos reservados.
          </Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1E2B4A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1E2B4A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  lastInfoItem: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  commitContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commitHash: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E2B4A",
    fontFamily: "monospace",
    marginRight: 12,
  },
  commitFull: {
    fontSize: 11,
    color: "#999",
    fontFamily: "monospace",
    marginTop: 4,
  },
  descriptionSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

