import { useState } from "react";
import { StatusBar, View, Text } from "react-native";

// Importar componentes
import LoginCuidador from "./screens/LoginCuidador";
import RegistroDoente from "./screens/RegistroDoente";
import Dashboard from "./screens/Dashboard";
import ContactosEmergencia from "./screens/ContactosEmergencia";
import Historico from "./screens/Historico";
import Alertas from "./screens/Alertas";
import Definicoes from "./screens/Definicoes";

// Importar hooks e utilitários
import { useAuth } from "./hooks/useAuth";
import { useFirebaseData } from "./hooks/useFirebaseData";
import { useContactForm } from "./hooks/useContactForm";
import { guardarContacto, eliminarContacto, mostrarConfirmacaoEliminacao } from "./utils/contactService";
import { formatarTelemovel, validarFormulario, codigosPais } from "./utils/contactUtils";
import { estado, corEstado, iconeEstado } from "./utils/estadoUtils";

// Importar estilos
import styles from "./styles/styles";

export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  
  // Hook de autenticação
  const { user, doente, isLoading, registrarCuidador, registrarDoente } = useAuth();
  
  // Usar hooks personalizados (só se estiver autenticado)
  const { historicoMovimentos, alertas, contactos } = useFirebaseData();
  const {
    form,
    setForm,
    erros,
    setErros,
    mensagemSucesso,
    setMensagemSucesso,
    codigoPais,
    setCodigoPais,
    mostrarModalPais,
    setMostrarModalPais,
    confirmarEliminacao,
    setConfirmarEliminacao,
    mostrarMensagemSucesso: showSuccessMessage,
  } = useContactForm();

  // Funções wrapper para os serviços
  const handleGuardarContacto = () => {
    guardarContacto(form, codigoPais, contactos, setForm, setErros, showSuccessMessage);
  };

  const handleEliminarContacto = (id) => {
    eliminarContacto(id, setConfirmarEliminacao, showSuccessMessage);
  };

  const handleMostrarConfirmacaoEliminacao = (contacto) => {
    mostrarConfirmacaoEliminacao(contacto, setConfirmarEliminacao);
  };

  // Estado de loading inicial
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>A carregar...</Text>
      </View>
    );
  }

  // Se já existe cuidador e doente, vai diretamente para dashboard
  if (user && doente) {
    // Renderizar componente baseado na página
    if (pagina === "dashboard") {
      return (
        <Dashboard 
          setPagina={setPagina}
          styles={styles}
          estado={estado}
          corEstado={corEstado}
          iconeEstado={iconeEstado}
          doente={doente}
          user={user}
        />
      );
    }

    if (pagina === "alertas") {
      return (
        <Alertas 
          setPagina={setPagina}
          styles={styles}
          alertas={alertas}
        />
      );
    }

    if (pagina === "historico") {
      return (
        <Historico 
          setPagina={setPagina}
          styles={styles}
          historicoMovimentos={historicoMovimentos}
        />
      );
    }

    if (pagina === "contactos") {
      return (
        <ContactosEmergencia
          setPagina={setPagina}
          styles={styles}
          mensagemSucesso={mensagemSucesso}
          form={form}
          setForm={setForm}
          erros={erros}
          setErros={setErros}
          contactos={contactos}
          mostrarModalPais={mostrarModalPais}
          setMostrarModalPais={setMostrarModalPais}
          codigoPais={codigoPais}
          setCodigoPais={setCodigoPais}
          codigosPais={codigosPais}
          confirmarEliminacao={confirmarEliminacao}
          setConfirmarEliminacao={setConfirmarEliminacao}
          guardarContacto={handleGuardarContacto}
          formatarTelemovel={formatarTelemovel}
          eliminarContacto={handleEliminarContacto}
        />
      );
    }

    if (pagina === "definicoes") {
      return (
        <Definicoes 
          setPagina={setPagina}
          styles={styles}
        />
      );
    }
  }

  // Se não há utilizador, mostrar registro do cuidador
  if (!user) {
    return (
      <LoginCuidador 
        onRegistro={registrarCuidador}
        styles={styles}
      />
    );
  }

  // Se há utilizador mas não há doente, mostrar registro do doente
  if (!doente) {
    return (
      <RegistroDoente 
        onRegistro={registrarDoente}
        styles={styles}
      />
    );
  }

  return null;
}
