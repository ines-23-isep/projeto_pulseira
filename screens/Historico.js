import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import HealthChart from "../components/HealthChart";

export default function Historico({ setPagina, styles, quedas, historicoMovimentos, dadosBatimentos, historicoBatimentos, historicoTemperatura, historicoOxigenacao }) {
  const [vistaAtual, setVistaAtual] = useState("cards"); // cards, quedas, batimentos, temperatura, oxigenacao

  const renderCards = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={[styles.titulo, { marginBottom: 20 }]}>Histórico Completo</Text>
      
      {/* Card de Quedas */}
      <TouchableOpacity
        style={[styles.card, styles.cardElevated, { marginBottom: 15, borderLeftWidth: 4, borderLeftColor: "#dc2626" }]}
        onPress={() => setVistaAtual("quedas")}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.cardIconContainer, { backgroundColor: '#fef2f2' }]}>
            <FontAwesome5 name="exclamation-triangle" size={22} color="#dc2626" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.cardTitulo}>Histórico de Quedas</Text>
            <Text style={styles.cardValor}>{quedas.length} registos</Text>
            <View style={styles.cardStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: quedas.length > 0 ? "#ef4444" : "#10b981" }]} />
              <Text style={styles.cardInfo}>
                {quedas.length > 0 ? "Ver registos" : "Nenhuma queda"}
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#64748b" />
        </View>
      </TouchableOpacity>

      {/* Card de Batimentos Cardíacos */}
      <TouchableOpacity
        style={[styles.card, styles.cardElevated, { marginBottom: 15, borderLeftWidth: 4, borderLeftColor: "#ef4444" }]}
        onPress={() => setVistaAtual("batimentos")}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.cardIconContainer, { backgroundColor: '#fef2f2' }]}>
            <FontAwesome5 name="heartbeat" size={22} color="#ef4444" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.cardTitulo}>Batimentos Cardíacos</Text>
            <Text style={[styles.cardInfo, { fontSize: 11, marginBottom: 2 }]}>
              Última atualização:
            </Text>
            <Text style={styles.cardValor}>{dadosBatimentos?.bpm || "72 bpm"}</Text>
            <View style={styles.cardStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: historicoBatimentos.length > 0 ? "#ef4444" : "#10b981" }]} />
              <Text style={styles.cardInfo}>
                {historicoBatimentos.length > 0 ? `${historicoBatimentos.length} registos (48h)` : "Sem registos"}
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#64748b" />
        </View>
      </TouchableOpacity>

      {/* Card de Temperatura */}
      <TouchableOpacity
        style={[styles.card, styles.cardElevated, { marginBottom: 15, borderLeftWidth: 4, borderLeftColor: "#f59e0b" }]}
        onPress={() => setVistaAtual("temperatura")}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.cardIconContainer, { backgroundColor: '#fffbeb' }]}>
            <MaterialIcons name="thermostat" size={22} color="#f59e0b" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.cardTitulo}>Temperatura Corporal</Text>
            <Text style={[styles.cardInfo, { fontSize: 11, marginBottom: 2 }]}>
              Última atualização:
            </Text>
            <Text style={styles.cardValor}>{dadosBatimentos?.tempC || "36.5 ºC"}</Text>
            <View style={styles.cardStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: historicoTemperatura.length > 0 ? "#f59e0b" : "#10b981" }]} />
              <Text style={styles.cardInfo}>
                {historicoTemperatura.length > 0 ? `${historicoTemperatura.length} registos (48h)` : "Sem registos"}
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#64748b" />
        </View>
      </TouchableOpacity>

      {/* Card de Oxigenação */}
      <TouchableOpacity
        style={[styles.card, styles.cardElevated, { marginBottom: 15, borderLeftWidth: 4, borderLeftColor: "#3b82f6" }]}
        onPress={() => setVistaAtual("oxigenacao")}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.cardIconContainer, { backgroundColor: '#eff6ff' }]}>
            <FontAwesome5 name="lungs" size={22} color="#3b82f6" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.cardTitulo}>Oxigenação</Text>
            <Text style={[styles.cardInfo, { fontSize: 11, marginBottom: 2 }]}>
              Última atualização:
            </Text>
            <Text style={styles.cardValor}>{dadosBatimentos?.spo2 || "98 %"}</Text>
            <View style={styles.cardStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: historicoOxigenacao.length > 0 ? "#3b82f6" : "#10b981" }]} />
              <Text style={styles.cardInfo}>
                {historicoOxigenacao.length > 0 ? `${historicoOxigenacao.length} registos (48h)` : "Sem registos"}
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#64748b" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHistoricoQuedas = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setVistaAtual("cards")}>
          <MaterialIcons name="arrow-back" size={28} color="#64748b" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { marginBottom: 0 }]}>Histórico de Quedas</Text>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {quedas.length === 0 ? (
          <View style={styles.semDadosContainer}>
            <MaterialIcons name="history" size={48} color="#64748b" />
            <Text style={styles.semDadosTexto}>Nenhuma queda registada</Text>
            <Text style={[styles.semDadosTexto, { marginTop: 10, fontSize: 14 }]}>
              Quando uma queda for detetada, aparecerá aqui
            </Text>
          </View>
        ) : (
          quedas.map((queda) => (
            <View key={queda.id} style={[styles.cardHistorico, { borderLeftColor: "#dc2626" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historicoTexto, { color: "#dc2626", fontWeight: "bold" }]}>
                  🚨 Queda Detetada
                </Text>
                <Text style={styles.historicoHora}>
                  {queda.timestamp || new Date(queda.id).toLocaleString('pt-PT')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderHistoricoBatimentos = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setVistaAtual("cards")}>
          <MaterialIcons name="arrow-back" size={28} color="#64748b" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { marginBottom: 0 }]}>Histórico de Batimentos</Text>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Gráfico */}
        <HealthChart
          data={historicoBatimentos}
          title="Batimentos Cardíacos"
          color="#ef4444"
          unit="BPM"
        />
        
        {historicoBatimentos.length === 0 ? (
          <View style={styles.semDadosContainer}>
            <FontAwesome5 name="heartbeat" size={48} color="#ef4444" />
            <Text style={styles.semDadosTexto}>Sem registos nas últimas 48h</Text>
            <Text style={[styles.semDadosTexto, { marginTop: 10, fontSize: 14 }]}>
              Atual: {dadosBatimentos?.bpm || "72 bpm"}
            </Text>
          </View>
        ) : (
          historicoBatimentos.map((item) => (
            <View key={item.id} style={[styles.cardHistorico, { borderLeftColor: "#ef4444" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historicoTexto, { color: "#ef4444", fontWeight: "bold" }]}>
                  ❤️ {item.valor}
                </Text>
                <Text style={styles.historicoHora}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderHistoricoTemperatura = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setVistaAtual("cards")}>
          <MaterialIcons name="arrow-back" size={28} color="#64748b" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { marginBottom: 0 }]}>Histórico de Temperatura</Text>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Gráfico */}
        <HealthChart
          data={historicoTemperatura}
          title="Temperatura Corporal"
          color="#f59e0b"
          unit="°C"
        />
        
        {historicoTemperatura.length === 0 ? (
          <View style={styles.semDadosContainer}>
            <MaterialIcons name="thermostat" size={48} color="#f59e0b" />
            <Text style={styles.semDadosTexto}>Sem registos nas últimas 48h</Text>
            <Text style={[styles.semDadosTexto, { marginTop: 10, fontSize: 14 }]}>
              Atual: {dadosBatimentos?.tempC || "36.5 ºC"}
            </Text>
          </View>
        ) : (
          historicoTemperatura.map((item) => (
            <View key={item.id} style={[styles.cardHistorico, { borderLeftColor: "#f59e0b" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historicoTexto, { color: "#f59e0b", fontWeight: "bold" }]}>
                  🌡️ {item.valor}
                </Text>
                <Text style={styles.historicoHora}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderHistoricoOxigenacao = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setVistaAtual("cards")}>
          <MaterialIcons name="arrow-back" size={28} color="#64748b" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { marginBottom: 0 }]}>Histórico de Oxigenação</Text>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Gráfico */}
        <HealthChart
          data={historicoOxigenacao}
          title="Oxigenação"
          color="#3b82f6"
          unit="%"
        />
        
        {historicoOxigenacao.length === 0 ? (
          <View style={styles.semDadosContainer}>
            <FontAwesome5 name="lungs" size={48} color="#3b82f6" />
            <Text style={styles.semDadosTexto}>Sem registos nas últimas 48h</Text>
            <Text style={[styles.semDadosTexto, { marginTop: 10, fontSize: 14 }]}>
              Atual: {dadosBatimentos?.spo2 || "98 %"}
            </Text>
          </View>
        ) : (
          historicoOxigenacao.map((item) => (
            <View key={item.id} style={[styles.cardHistorico, { borderLeftColor: "#3b82f6" }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historicoTexto, { color: "#3b82f6", fontWeight: "bold" }]}>
                  🫁 {item.valor}
                </Text>
                <Text style={styles.historicoHora}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.container, { paddingTop: 60 }]}>
        
        {vistaAtual === "cards" && renderCards()}
        {vistaAtual === "quedas" && renderHistoricoQuedas()}
        {vistaAtual === "batimentos" && renderHistoricoBatimentos()}
        {vistaAtual === "temperatura" && renderHistoricoTemperatura()}
        {vistaAtual === "oxigenacao" && renderHistoricoOxigenacao()}

        {vistaAtual === "cards" && (
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => setPagina("dashboard")}
          >
            <Text style={styles.botaoVoltarTexto}>← Voltar ao Painel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
