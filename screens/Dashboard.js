import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert } from "react-native";
import { useEffect } from "react";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function Dashboard({ setPagina, styles, estado, corEstado, iconeEstado, quedaDetetadaAgora, estadoAtual, textoAtualizacao, user, dadosBatimentos }) {
  
  useEffect(() => {
    if (quedaDetetadaAgora) {
      Alert.alert(
        "⚠️ Queda Detetada!",
        "Foi detetada uma queda agora. Verifique o histórico para mais detalhes.",
        [
          {
            text: "Ver Histórico",
            onPress: () => setPagina("historico"),
            style: "default",
          },
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }, [quedaDetetadaAgora]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
        
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.saudacaoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={32} color="#64748b" />
              </View>
              <View>
                <Text style={styles.saudacao}>Olá, {user?.nome || 'Utilizador'}</Text>
                <Text style={styles.dataAtual}>{new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.botaoDefinicoesHeader}
            onPress={() => setPagina("definicoes")}
          >
            <Ionicons name="settings-outline" size={28} color="#64748b" />
          </TouchableOpacity>
        </View>
        <Text style={styles.titulo}>Monitorização em</Text>
        <Text style={styles.subtitulo}>Tempo Real</Text>
      </View>

      {/* Cartão de Status */}
      <View style={[styles.estadoCard, { 
        backgroundColor: corEstado(estadoAtual),
        shadowColor: corEstado(estadoAtual),
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.estadoIconeContainer}>
            {estadoAtual === "Queda Detetada" ? (
              <FontAwesome5 name="exclamation-triangle" size={28} color="#ffffff" />
            ) : (
              <MaterialIcons name="check-circle" size={28} color="#ffffff" />
            )}
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.estadoTexto}>Estado Atual</Text>
            <Text style={styles.estadoValor}>{estadoAtual}</Text>
            <View style={styles.estadoDetalhes}>
              <Text style={styles.estadoDetalhesTexto}>{textoAtualizacao}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cartão de Batimentos Cardíacos */}
      <View style={[styles.card, styles.cardElevated, { marginBottom: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.cardIconContainer}>
            <FontAwesome5 name="heartbeat" size={22} color="#ef4444" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.cardTitulo}>Batimentos Cardíacos</Text>
            <Text style={styles.cardValor}>{dadosBatimentos?.bpm || "72 bpm"}</Text>
            <View style={styles.cardStatus}>
              <View style={[styles.statusIndicator, {backgroundColor: '#10b981'}]} />
              <Text style={styles.cardInfo}>Normal</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cards de Informação */}
      <View style={styles.cardsContainer}>
        {/* Card Temperatura Corporal */}
        <View style={[styles.card, styles.cardElevated, { flex: 1, minWidth: '45%', marginRight: 10 }]}>
          <View style={styles.cardIconContainer}>
            <MaterialIcons name="thermostat" size={22} color="#f59e0b" />
          </View>
          <Text style={styles.cardTitulo}>Temperatura</Text>
          <Text style={styles.cardValor}>{dadosBatimentos?.tempC || "36.5 ºC"}</Text>
          <View style={styles.cardStatus}>
            <View style={[styles.statusIndicator, {backgroundColor: '#10b981'}]} />
            <Text style={styles.cardInfo}>Normal</Text>
          </View>
        </View>

        {/* Card Oxigenação */}
        <View style={[styles.card, styles.cardElevated, { flex: 1, minWidth: '45%', marginLeft: 10 }]}>
          <View style={styles.cardIconContainer}>
            <FontAwesome5 name="lungs" size={22} color="#3b82f6" />
          </View>
          <Text style={styles.cardTitulo}>Oxigenação</Text>
          <Text style={styles.cardValor}>{dadosBatimentos?.spo2 || "98 %"}</Text>
          <View style={styles.cardStatus}>
            <View style={[styles.statusIndicator, {backgroundColor: '#10b981'}]} />
            <Text style={styles.cardInfo}>Normal</Text>
          </View>
        </View>
      </View>

      
      {/* NAVEGAÇÃO */}
      <View style={styles.botoesContainer}>
        <View style={styles.botoesLinha}>
          <View style={styles.botaoWrapper}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => setPagina("historico")}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="history" size={22} color="#ffffff" style={{ marginRight: 1 }} />
                <Text style={[styles.botaoTexto, {textAlign: 'center'}]}>Histórico Completo</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.botaoWrapper}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => setPagina("contactos")}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="phone" size={22} color="#ffffff" style={{ marginRight: 1 }} />
                <Text style={[styles.botaoTexto, {textAlign: 'center'}]}>Contactos de Emergência</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
