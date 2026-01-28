export function corEstado(estado) {
  if (estado === "Normal") return "#2ecc71";
  if (estado === "Em risco") return "#f1c40f";
  if (estado === "Queda Detetada") return "#e74c3c";
  if (estado === "Alerta") return "#e74c3c";
  return "#2ecc71"; // Default para Normal
}

export function iconeEstado(estado) {
  if (estado === "Normal") return "✔️";
  if (estado === "Em risco") return "⚠️";
  if (estado === "Queda Detetada") return "🚨";
  if (estado === "Alerta") return "🚨";
  return "✔️"; // Default para Normal
}
