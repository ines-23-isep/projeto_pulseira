import { ref, onValue, push, set, update } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import { validarFormulario } from "./contactUtils";

export function guardarContacto(form, codigoPais, contactos, setForm, setErros, mostrarMensagemSucesso) {
  const novosErros = validarFormulario(form, codigoPais, contactos);
  setErros(novosErros);
  
  if (Object.keys(novosErros).length > 0) return;

  const baseRef = ref(database, "contactos/pulseira001");
  const dadosContacto = {
    nome: form.nome ? form.nome.trim() : "",
    relacao: form.relacao ? form.relacao.trim() : "",
    telemovel: form.telemovel ? `${codigoPais} ${form.telemovel.replace(/\s/g, '')}` : "", // Inclui código do país
    prioridade: parseInt(String(form.prioridade).trim()), // Converte para número
    codigoPais: codigoPais, // Guarda o código do país
  };

  if (form.id) {
    update(ref(database, `contactos/pulseira001/${form.id}`), dadosContacto);
    mostrarMensagemSucesso("✅ Contacto atualizado com sucesso!");
  } else {
    const novo = push(baseRef);
    set(novo, dadosContacto);
    mostrarMensagemSucesso("✅ Contacto adicionado com sucesso!");
  }

  // Limpar formulário e erros
  setForm({ id: null, nome: "", relacao: "", telemovel: "", prioridade: "" });
  setErros({});
}

export function eliminarContacto(id, setConfirmarEliminacao, mostrarMensagemSucesso) {
  const refContacto = ref(database, `contactos/pulseira001/${id}`);
  set(refContacto, null);
  setConfirmarEliminacao(null);
  mostrarMensagemSucesso("🗑️ Contacto eliminado com sucesso!");
}

export function mostrarConfirmacaoEliminacao(contacto, setConfirmarEliminacao) {
  setConfirmarEliminacao(contacto);
}
