import { View, Text, TouchableOpacity, ScrollView, StatusBar, Animated, Image } from "react-native";
import { useState, useEffect, useRef } from "react";

export default function WelcomeScreen({ onIniciar, styles }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animações de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f172a" }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" backgroundColor="#0f172a" />
      
      <View style={styles.welcomeContainer}>
        {/* Cabeçalho com gradiente */}
        <View style={styles.welcomeHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.logoInnerImage}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <Animated.View 
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.appTitle}>AlwaysThere</Text>
            <Text style={styles.appSubtitle}>Monitorização Inteligente 24/7</Text>
          </Animated.View>
        </View>

        {/* Conteúdo principal */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Estatísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Disponibilidade</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Confiável</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Cuidado</Text>
            </View>
          </View>

          {/* Botão principal */}
          <TouchableOpacity 
            style={styles.iniciarButton}
            onPress={onIniciar}
            activeOpacity={0.8}
          >
            <Text style={styles.iniciarButtonText}>Iniciar</Text>
            <View style={styles.buttonIcon}>
              <Text style={styles.buttonIconText}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Texto informativo */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              A sua tranquilidade é a nossa prioridade
            </Text>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            © 2026 AlwaysThere - Tecnologia ao serviço do cuidado
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
