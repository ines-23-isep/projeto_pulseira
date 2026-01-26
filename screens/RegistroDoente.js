import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";

export default function RegistroDoente({ onRegistro, styles }) {
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    sexo: "",
    altura: "",
    peso: "",
    problemasMobilidade: false,
    historicoQuedas: false,
    doencasCardiacas: false,
    hipertensao: false,
    diabetes: false,
    doencaNeurologica: false,
    tonturasFrequentes: false,
    problemasVisao: false,
    outraCondicao: "",
    outraCondicaoChecked: false
  });
  const [erros, setErros] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  function validarFormulario() {
    const novosErros = {};
    
    // Validação do nome
    if (!form.nome || !form.nome.trim()) {
      novosErros.nome = "Nome do doente é obrigatório";
    } else if (form.nome.trim().length < 3) {
      novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
    }
    
    // Validação da idade
    if (!form.idade || !form.idade.trim()) {
      novosErros.idade = "Idade é obrigatória";
    } else {
      const idadeNum = parseInt(form.idade);
      if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 150) {
        novosErros.idade = "Idade deve ser um número entre 0 e 150";
      }
    }

    // Validação do sexo
    if (!form.sexo) {
      novosErros.sexo = "Sexo é obrigatório";
    }

    // Validação da altura (opcional)
    if (form.altura && form.altura.trim()) {
      const alturaNum = parseFloat(form.altura);
      if (isNaN(alturaNum) || alturaNum < 50 || alturaNum > 250) {
        novosErros.altura = "Altura deve ser um número entre 50 e 250 cm";
      }
    }

    // Validação do peso (opcional)
    if (form.peso && form.peso.trim()) {
      const pesoNum = parseFloat(form.peso);
      if (isNaN(pesoNum) || pesoNum < 10 || pesoNum > 300) {
        novosErros.peso = "Peso deve ser um número entre 10 e 300 kg";
      }
    }

    // Validação da condição "Outro"
    if (form.outraCondicaoChecked && (!form.outraCondicao || !form.outraCondicao.trim())) {
      novosErros.outraCondicao = "Descreva a outra condição";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit() {
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    try {
      await onRegistro(form);
    } catch (error) {
      setErros({ geral: "Ocorreu um erro ao guardar os dados. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  }

  function toggleCondicao(key) {
    if (key === "outraCondicaoChecked") {
      setForm({ ...form, [key]: !form[key], outraCondicao: !form[key] ? form.outraCondicao : "" });
    } else {
      setForm({ ...form, [key]: !form[key] });
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      
      <View style={styles.loginContainer}>
        {/* Cabeçalho */}
        <View style={styles.loginHeader}>
          <View style={styles.loginLogo}>
            <Text style={styles.loginLogoText}>👤</Text>
          </View>
          <Text style={styles.loginTitulo}>Registro do Doente</Text>
          <Text style={styles.loginSubtitulo}>
            Preencha os dados do paciente que será monitorizado
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.loginForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              placeholder="Nome do paciente"
              style={[styles.input, erros.nome && styles.inputErro]}
              value={form.nome}
              onChangeText={(v) => {
                setForm({ ...form, nome: v });
                if (erros.nome) setErros({ ...erros, nome: "" });
              }}
              autoCapitalize="words"
            />
            {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}
          </View>

          <View style={styles.dadosBasicosRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Idade</Text>
              <TextInput
                placeholder="Idade"
                style={[styles.input, erros.idade && styles.inputErro]}
                value={form.idade}
                onChangeText={(v) => {
                  setForm({ ...form, idade: v });
                  if (erros.idade) setErros({ ...erros, idade: "" });
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              {erros.idade && <Text style={styles.textoErro}>{erros.idade}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Sexo</Text>
              <View style={styles.sexoContainer}>
                <TouchableOpacity
                  style={[styles.sexoBotao, form.sexo === "M" && styles.sexoBotaoSelecionado]}
                  onPress={() => {
                    setForm({ ...form, sexo: "M" });
                    if (erros.sexo) setErros({ ...erros, sexo: "" });
                  }}
                >
                  <Text style={[styles.sexoBotaoTexto, form.sexo === "M" && styles.sexoBotaoTextoSelecionado]}>Masculino</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sexoBotao, form.sexo === "F" && styles.sexoBotaoSelecionado]}
                  onPress={() => {
                    setForm({ ...form, sexo: "F" });
                    if (erros.sexo) setErros({ ...erros, sexo: "" });
                  }}
                >
                  <Text style={[styles.sexoBotaoTexto, form.sexo === "F" && styles.sexoBotaoTextoSelecionado]}>Feminino</Text>
                </TouchableOpacity>
              </View>
              {erros.sexo && <Text style={styles.textoErro}>{erros.sexo}</Text>}
            </View>
          </View>

          <View style={styles.dadosBasicosRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Altura (cm) - Opcional</Text>
              <TextInput
                placeholder="Ex: 170"
                style={[styles.input, erros.altura && styles.inputErro]}
                value={form.altura}
                onChangeText={(v) => {
                  setForm({ ...form, altura: v });
                  if (erros.altura) setErros({ ...erros, altura: "" });
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              {erros.altura && <Text style={styles.textoErro}>{erros.altura}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Peso (kg) - Opcional</Text>
              <TextInput
                placeholder="Ex: 70"
                style={[styles.input, erros.peso && styles.inputErro]}
                value={form.peso}
                onChangeText={(v) => {
                  setForm({ ...form, peso: v });
                  if (erros.peso) setErros({ ...erros, peso: "" });
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              {erros.peso && <Text style={styles.textoErro}>{erros.peso}</Text>}
            </View>
          </View>

          {/* Condições de Saúde */}
          <View style={styles.condicoesContainer}>
            <Text style={styles.condicoesTitulo}>Condições de saúde</Text>
            <Text style={styles.condicoesSubtitulo}>Selecione todas as que aplicam:</Text>
            
            {condicoesOpcoes.map((opcao) => (
              <TouchableOpacity
                key={opcao.key}
                style={styles.condicaoItem}
                onPress={() => toggleCondicao(opcao.key)}
              >
                <View style={[styles.condicaoCheckbox, form[opcao.key] && styles.condicaoCheckboxSelecionado]}>
                  {form[opcao.key] && <Text style={styles.condicaoCheck}>✓</Text>}
                </View>
                <Text style={styles.condicaoLabel}>{opcao.label}</Text>
              </TouchableOpacity>
            ))}

            {form.outraCondicaoChecked && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descreva a outra condição</Text>
                <TextInput
                  placeholder="Especifique a condição..."
                  style={[styles.input, erros.outraCondicao && styles.inputErro]}
                  value={form.outraCondicao}
                  onChangeText={(v) => {
                    setForm({ ...form, outraCondicao: v });
                    if (erros.outraCondicao) setErros({ ...erros, outraCondicao: "" });
                  }}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
                {erros.outraCondicao && <Text style={styles.textoErro}>{erros.outraCondicao}</Text>}
              </View>
            )}
          </View>

          {erros.geral && (
            <View style={styles.erroGeral}>
              <Text style={styles.erroGeralTexto}>{erros.geral}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginBotao, isLoading && styles.botaoDesativado]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.loginBotaoTexto}>
              {isLoading ? "A processar..." : "Guardar Dados"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
