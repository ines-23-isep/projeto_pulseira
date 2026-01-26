import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";

export default function RegistroDoente({ onRegistro, styles }) {
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    condicao: "",
    medicacao: "",
    notas: ""
  });
  const [erros, setErros] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Validação da condição
    if (!form.condicao || !form.condicao.trim()) {
      novosErros.condicao = "Condição médica é obrigatória";
    } else if (form.condicao.trim().length < 5) {
      novosErros.condicao = "Descreva brevemente a condição médica";
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Idade</Text>
            <TextInput
              placeholder="Idade do paciente"
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Condição Médica</Text>
            <TextInput
              placeholder="Ex: Hipertensão, Diabetes, Alzheimer..."
              style={[styles.input, erros.condicao && styles.inputErro]}
              value={form.condicao}
              onChangeText={(v) => {
                setForm({ ...form, condicao: v });
                if (erros.condicao) setErros({ ...erros, condicao: "" });
              }}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {erros.condicao && <Text style={styles.textoErro}>{erros.condicao}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medicação (Opcional)</Text>
            <TextInput
              placeholder="Medicamentos em uso..."
              style={[styles.input, erros.medicacao && styles.inputErro]}
              value={form.medicacao}
              onChangeText={(v) => {
                setForm({ ...form, medicacao: v });
                if (erros.medicacao) setErros({ ...erros, medicacao: "" });
              }}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
            {erros.medicacao && <Text style={styles.textoErro}>{erros.medicacao}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notas Adicionais (Opcional)</Text>
            <TextInput
              placeholder="Informações relevantes sobre o paciente..."
              style={[styles.input, erros.notas && styles.inputErro]}
              value={form.notas}
              onChangeText={(v) => {
                setForm({ ...form, notas: v });
                if (erros.notas) setErros({ ...erros, notas: "" });
              }}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {erros.notas && <Text style={styles.textoErro}>{erros.notas}</Text>}
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

        {/* Informação */}
        <View style={styles.loginFooter}>
          <Text style={styles.loginFooterTexto}>
            Estes dados serão usados para personalizar o monitoramento
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
