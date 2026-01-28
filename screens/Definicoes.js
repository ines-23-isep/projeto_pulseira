import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar, Modal } from "react-native";

export default function Definicoes({ setPagina, styles, user, doente, atualizarCuidador, atualizarDoente }) {
  const [mostrarModalCuidador, setMostrarModalCuidador] = useState(false);
  const [mostrarModalDoente, setMostrarModalDoente] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Formulários
  const [formCuidador, setFormCuidador] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    password: "",
    telemovel: user?.telemovel || "",
    relacao: user?.relacao || ""
  });

  const [formDoente, setFormDoente] = useState({
    nome: doente?.nome || "",
    idade: doente?.idade?.toString() || "",
    sexo: doente?.sexo || "",
    altura: doente?.altura || "",
    peso: doente?.peso || "",
    problemasMobilidade: doente?.problemasMobilidade || false,
    historicoQuedas: doente?.historicoQuedas || false,
    doencasCardiacas: doente?.doencasCardiacas || false,
    hipertensao: doente?.hipertensao || false,
    diabetes: doente?.diabetes || false,
    doencaNeurologica: doente?.doencaNeurologica || false,
    tonturasFrequentes: doente?.tonturasFrequentes || false,
    problemasVisao: doente?.problemasVisao || false,
    outraCondicao: doente?.outraCondicao || "",
    outraCondicaoChecked: doente?.outraCondicaoChecked || false
  });

  const [erros, setErros] = useState({});

  const condicoesOpcoes = [
    { key: "problemasMobilidade", label: "Problemas de mobilidade" },
    { key: "historicoQuedas", label: "Histórico de quedas" },
    { key: "doencasCardiacas", label: "Doenças cardíacas" },
    { key: "hipertensao", label: "Hipertensão" },
    { key: "diabetes", label: "Diabetes" },
    { key: "doencaNeurologica", label: "Doença neurológica (ex: Parkinson, Alzheimer)" },
    { key: "tonturasFrequentes", label: "Tonturas frequentes" },
    { key: "problemasVisao", label: "Problemas de visão" },
    { key: "outraCondicaoChecked", label: "Outro" }
  ];

  function validarFormularioCuidador() {
    const novosErros = {};
    
    if (!formCuidador.nome || !formCuidador.nome.trim()) {
      novosErros.nome = "Nome é obrigatório";
    }
    
    if (!formCuidador.email || !formCuidador.email.trim()) {
      novosErros.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formCuidador.email)) {
      novosErros.email = "Email inválido";
    }
    
    if (formCuidador.password && formCuidador.password.length < 6) {
      novosErros.password = "Password deve ter pelo menos 6 caracteres";
    }

    if (!formCuidador.telemovel || !formCuidador.telemovel.trim()) {
      novosErros.telemovel = "Telemóvel é obrigatório";
    } else if (!/^9\d{8}$/.test(formCuidador.telemovel.replace(/\s/g, ''))) {
      novosErros.telemovel = "Telemóvel inválido. Use: 9xx xxx xxx";
    }
    
    if (!formCuidador.relacao || !formCuidador.relacao.trim()) {
      novosErros.relacao = "Relação com o doente é obrigatória";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function validarFormularioDoente() {
    const novosErros = {};
    
    if (!formDoente.nome || !formDoente.nome.trim()) {
      novosErros.nome = "Nome do doente é obrigatório";
    }
    
    if (!formDoente.idade || !formDoente.idade.trim()) {
      novosErros.idade = "Idade é obrigatória";
    } else if (parseInt(formDoente.idade) < 1 || parseInt(formDoente.idade) > 120) {
      novosErros.idade = "Idade deve estar entre 1 e 120 anos";
    }
    
    if (!formDoente.sexo || !formDoente.sexo.trim()) {
      novosErros.sexo = "Sexo é obrigatório";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleAtualizarCuidador() {
    if (!validarFormularioCuidador()) return;
    
    setIsLoading(true);
    try {
      await atualizarCuidador(formCuidador);
      setMensagemSucesso("Dados do cuidador atualizados com sucesso!");
      setMostrarModalCuidador(false);
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (error) {
      setErros({ geral: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAtualizarDoente() {
    if (!validarFormularioDoente()) return;
    
    setIsLoading(true);
    try {
      await atualizarDoente(formDoente);
      setMensagemSucesso("Dados do doente atualizados com sucesso!");
      setMostrarModalDoente(false);
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (error) {
      setErros({ geral: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Definições</Text>
        <Text style={styles.subtitulo}>Editar Dados</Text>

        {/* Mensagem de sucesso */}
        {mensagemSucesso && (
          <View style={styles.mensagemSucesso}>
            <Text style={styles.mensagemSucessoTexto}>{mensagemSucesso}</Text>
          </View>
        )}

        {/* Cards de opções */}
        <View style={styles.cardsContainer}>
          {/* Card Atualizar Cuidador */}
          <TouchableOpacity 
            style={[styles.card, styles.cardElevated, { flex: 1, minWidth: '45%', marginRight: 10 }]}
            onPress={() => setMostrarModalCuidador(true)}
          >
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>👤</Text>
            </View>
            <Text style={styles.cardTitulo}>Atualizar Cuidador</Text>
            <Text style={styles.cardInfo}>{user?.nome || "Carregando..."}</Text>
            <Text style={[styles.cardInfo, { fontSize: 12, marginTop: 4 }]}>
              {user?.email || "Carregando..."}
            </Text>
          </TouchableOpacity>

          {/* Card Atualizar Doente */}
          <TouchableOpacity 
            style={[styles.card, styles.cardElevated, { flex: 1, minWidth: '45%', marginLeft: 10 }]}
            onPress={() => setMostrarModalDoente(true)}
          >
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>🏥</Text>
            </View>
            <Text style={styles.cardTitulo}>Atualizar Doente</Text>
            <Text style={styles.cardInfo}>{doente?.nome || "Carregando..."}</Text>
            <Text style={[styles.cardInfo, { fontSize: 12, marginTop: 4 }]}>
              {doente?.idade ? `${doente.idade} anos` : "Carregando..."}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => setPagina("dashboard")}
        >
          <Text style={styles.botaoVoltarTexto}>← Voltar ao Painel</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Editar Cuidador */}
      <Modal
        visible={mostrarModalCuidador}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
          <View style={[styles.container, { paddingTop: 60 }]}>
            <Text style={[styles.titulo, { marginBottom: 20 }]}>Atualizar Dados do Cuidador</Text>
            <Text style={styles.subtitulo}>Edite as informações do cuidador</Text>

            {erros.geral && (
              <View style={styles.erroGeral}>
                <Text style={styles.erroGeralTexto}>{erros.geral}</Text>
              </View>
            )}

            <View style={styles.formularioCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={[styles.input, erros.nome && styles.inputErro]}
                  value={formCuidador.nome}
                  onChangeText={(text) => setFormCuidador({...formCuidador, nome: text})}
                  placeholder="Nome do cuidador"
                />
                {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, erros.email && styles.inputErro]}
                  value={formCuidador.email}
                  onChangeText={(text) => setFormCuidador({...formCuidador, email: text})}
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {erros.email && <Text style={styles.textoErro}>{erros.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nova Password (deixe em branco para manter)</Text>
                <TextInput
                  style={[styles.input, erros.password && styles.inputErro]}
                  value={formCuidador.password}
                  onChangeText={(text) => setFormCuidador({...formCuidador, password: text})}
                  placeholder="Nova password"
                  secureTextEntry
                />
                {erros.password && <Text style={styles.textoErro}>{erros.password}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telemóvel</Text>
                <TextInput
                  style={[styles.input, erros.telemovel && styles.inputErro]}
                  value={formCuidador.telemovel}
                  onChangeText={(text) => setFormCuidador({...formCuidador, telemovel: text})}
                  placeholder="9xx xxx xxx"
                  keyboardType="phone-pad"
                />
                {erros.telemovel && <Text style={styles.textoErro}>{erros.telemovel}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relação com o doente</Text>
                <TextInput
                  style={[styles.input, erros.relacao && styles.inputErro]}
                  value={formCuidador.relacao}
                  onChangeText={(text) => setFormCuidador({...formCuidador, relacao: text})}
                  placeholder="Ex: Filho, Esposa, Irmão"
                />
                {erros.relacao && <Text style={styles.textoErro}>{erros.relacao}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.botaoPrimario, styles.botao, isLoading && styles.botaoDesativado]}
                onPress={handleAtualizarCuidador}
                disabled={isLoading}
              >
                <Text style={styles.botaoTexto}>
                  {isLoading ? "A guardar..." : "Guardar Alterações"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoSecundario, { marginTop: 10 }]}
                onPress={() => setMostrarModalCuidador(false)}
              >
                <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/* Modal Editar Doente */}
      <Modal
        visible={mostrarModalDoente}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
          <View style={[styles.container, { paddingTop: 60 }]}>
            <Text style={[styles.titulo, { marginBottom: 20 }]}>Atualizar Dados do Doente</Text>
            <Text style={styles.subtitulo}>Edite as informações do doente</Text>

            {erros.geral && (
              <View style={styles.erroGeral}>
                <Text style={styles.erroGeralTexto}>{erros.geral}</Text>
              </View>
            )}

            <View style={styles.formularioCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={[styles.input, erros.nome && styles.inputErro]}
                  value={formDoente.nome}
                  onChangeText={(text) => setFormDoente({...formDoente, nome: text})}
                  placeholder="Nome do doente"
                />
                {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}
              </View>

              <View style={styles.dadosBasicosRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Idade</Text>
                  <TextInput
                    style={[styles.input, erros.idade && styles.inputErro]}
                    value={formDoente.idade}
                    onChangeText={(text) => setFormDoente({...formDoente, idade: text})}
                    placeholder="Idade"
                    keyboardType="numeric"
                  />
                  {erros.idade && <Text style={styles.textoErro}>{erros.idade}</Text>}
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Sexo</Text>
                  <View style={styles.sexoContainer}>
                    <TouchableOpacity
                      style={[
                        styles.sexoBotao,
                        formDoente.sexo === "Masculino" && styles.sexoBotaoSelecionado
                      ]}
                      onPress={() => setFormDoente({...formDoente, sexo: "Masculino"})}
                    >
                      <Text style={[
                        styles.sexoBotaoTexto,
                        formDoente.sexo === "Masculino" && styles.sexoBotaoTextoSelecionado
                      ]}>
                        Masculino
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.sexoBotao,
                        formDoente.sexo === "Feminino" && styles.sexoBotaoSelecionado
                      ]}
                      onPress={() => setFormDoente({...formDoente, sexo: "Feminino"})}
                    >
                      <Text style={[
                        styles.sexoBotaoTexto,
                        formDoente.sexo === "Feminino" && styles.sexoBotaoTextoSelecionado
                      ]}>
                        Feminino
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {erros.sexo && <Text style={styles.textoErro}>{erros.sexo}</Text>}
                </View>
              </View>

              <View style={styles.dadosBasicosRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Altura (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={formDoente.altura}
                    onChangeText={(text) => setFormDoente({...formDoente, altura: text})}
                    placeholder="170"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Peso (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={formDoente.peso}
                    onChangeText={(text) => setFormDoente({...formDoente, peso: text})}
                    placeholder="70"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.condicoesContainer}>
                <Text style={styles.condicoesTitulo}>Condições de Saúde</Text>
                <Text style={styles.condicoesSubtitulo}>Selecione as condições aplicáveis</Text>
                
                {condicoesOpcoes.map((condicao) => (
                  <TouchableOpacity
                    key={condicao.key}
                    style={styles.condicaoItem}
                    onPress={() => {
                      if (condicao.key === "outraCondicaoChecked") {
                        setFormDoente({...formDoente, outraCondicaoChecked: !formDoente.outraCondicaoChecked});
                      } else {
                        setFormDoente({...formDoente, [condicao.key]: !formDoente[condicao.key]});
                      }
                    }}
                  >
                    <View style={[
                      styles.condicaoCheckbox,
                      formDoente[condicao.key] && styles.condicaoCheckboxSelecionado
                    ]}>
                      {formDoente[condicao.key] && <Text style={styles.condicaoCheck}>✓</Text>}
                    </View>
                    <Text style={styles.condicaoLabel}>{condicao.label}</Text>
                  </TouchableOpacity>
                ))}

                {formDoente.outraCondicaoChecked && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Descreva outra condição</Text>
                    <TextInput
                      style={styles.input}
                      value={formDoente.outraCondicao}
                      onChangeText={(text) => setFormDoente({...formDoente, outraCondicao: text})}
                      placeholder="Descreva a condição..."
                      multiline
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.botaoPrimario, styles.botao, isLoading && styles.botaoDesativado]}
                onPress={handleAtualizarDoente}
                disabled={isLoading}
              >
                <Text style={styles.botaoTexto}>
                  {isLoading ? "A guardar..." : "Guardar Alterações"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoSecundario, { marginTop: 10 }]}
                onPress={() => setMostrarModalDoente(false)}
              >
                <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
