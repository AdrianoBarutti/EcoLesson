import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../src/services/firebaseConfig";

export default function Home() {
  const navigation = useNavigation<any>();

  const menuItems = [
    {
      id: 1,
      title: "Cursos",
      count: "5+ Cursos",
      screen: "Cursos",
      color: "#4A90E2",
      iconType: "book",
    },
    {
      id: 2,
      title: "Vagas",
      count: "10+ Vagas",
      screen: "Vagas",
      color: "#50C878",
      iconType: "briefcase",
    },
    {
      id: 3,
      title: "Empresas",
      count: "8+ Empresas",
      screen: "Empresas",
      color: "#FFB347",
      iconType: "building",
    },
    {
      id: 4,
      title: "Certificados",
      count: "Meus Certificados",
      screen: "Certificados",
      color: "#E74C3C",
      iconType: "certificate",
    },
  ];

  const getCategoryImage = (iconType: string) => {
    switch (iconType) {
      case "book":
        return require("../assets/cursos.png");
      case "briefcase":
        return require("../assets/vagas.png");
      case "building":
        return require("../assets/empresa.png");
      case "certificate":
        return require("../assets/certificado.png");
      default:
        return null;
    }
  };

  const getEmailName = () => {
    const email = auth.currentUser?.email || "";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1) || "Usuário";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ width: 40 }} />
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.profileButton}>
            <View style={styles.profileIconContainer}>
              <View style={styles.profileIconHead} />
              <View style={styles.profileIconBody} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerGreeting}>Olá, {getEmailName()},</Text>
          <Text style={styles.headerSubtitle}>O que você gostaria de aprender hoje?</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <View style={styles.searchIconCircle} />
            <View style={styles.searchIconLine} />
          </View>
          <Text style={styles.searchPlaceholder}>Buscar aqui</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorias</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.categoryCard, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconWrapper}>
                <Image
                  source={getCategoryImage(item.iconType)}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryCount}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  profileButton: {
    padding: 8,
  },
  profileIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileIconHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1E2B4A",
    position: "absolute",
    top: 6,
  },
  profileIconBody: {
    width: 20,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#1E2B4A",
    position: "absolute",
    bottom: 4,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerGreeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIconContainer: {
    width: 20,
    height: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#999",
    position: "absolute",
  },
  searchIconLine: {
    width: 6,
    height: 2,
    backgroundColor: "#999",
    borderRadius: 1,
    position: "absolute",
    right: 0,
    bottom: 0,
    transform: [{ rotate: "45deg" }],
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: "#999",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  menuGrid: {
    marginBottom: 30,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryCard: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
});

