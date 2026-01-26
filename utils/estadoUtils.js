// dados simulados
export const estado = "Normal"; // Normal | Em risco | Alerta

export function corEstado() {
  if (estado === "Normal") return "#2ecc71";
  if (estado === "Em risco") return "#f1c40f";
  if (estado === "Alerta") return "#e74c3c";
}

export function iconeEstado() {
  if (estado === "Normal") return "✔️";
  if (estado === "Em risco") return "⚠️";
  if (estado === "Alerta") return "🚨";
}
