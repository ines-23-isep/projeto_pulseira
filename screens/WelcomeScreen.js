import { View, Text, TouchableOpacity, ScrollView, StatusBar, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";

export default function WelcomeScreen({ onIniciar, styles }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Animações de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1200,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.welcomeContainer}>
      <StatusBar style="light" backgroundColor="#0f172a" />
      
      {/* Gradiente de fundo */}
      <View style={styles.backgroundGradient} />
      
      {/* Conteúdo principal */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Cabeçalho */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.brandName}>AlwaysThere</Text>
            <Text style={styles.tagline}>Cuidar à distância, com confiança</Text>
          </Animated.View>

          {/* Espaço flexível */}
          <View style={styles.spacer} />

          {/* Ícones de cuidado */}
          <Animated.View 
            style={[
              styles.iconsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.iconItem}>
              <Feather name="heart" size={32} color="#60a5fa" />
              <Text style={styles.iconLabel}>Cuidado</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="shield" size={32} color="#60a5fa" />
              <Text style={styles.iconLabel}>Segurança</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="home" size={32} color="#60a5fa" />
              <Text style={styles.iconLabel}>Conforto</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="smartphone" size={32} color="#60a5fa" />
              <Text style={styles.iconLabel}>Acesso</Text>
            </View>
          </Animated.View>

          {/* Estatísticas minimalistas */}
          <Animated.View 
            style={[
              styles.statsRow,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Disponível</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Confiável</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Cuidado</Text>
            </View>
          </Animated.View>

          {/* Botão principal */}
          <Animated.View 
            style={[
              styles.buttonSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onIniciar}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Começar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 AlwaysThere</Text>
      </View>
    </View>
  );
}
