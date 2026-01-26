import { useState } from "react";

export function useContactForm() {
  const [form, setForm] = useState({
    id: null,
    nome: "",
    relacao: "",
    telemovel: "",
    prioridade: "",
  });
  const [erros, setErros] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [codigoPais, setCodigoPais] = useState("+351");
  const [mostrarModalPais, setMostrarModalPais] = useState(false);
  const [confirmarEliminacao, setConfirmarEliminacao] = useState(null);

  function mostrarMensagemSucesso(texto) {
    setMensagemSucesso(texto);
    setTimeout(() => setMensagemSucesso(""), 3000);
  }

  return {
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
    mostrarMensagemSucesso,
  };
}
