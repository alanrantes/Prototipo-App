const materiais = [
  { id: "001", descricao: "Parafuso", centroCusto: "Manutenção", quantidade: 50, estoqueMinimo: 10 },
  { id: "002", descricao: "Porca", centroCusto: "Produção", quantidade: 20, estoqueMinimo: 5 },
  { id: "003", descricao: "Arruela", centroCusto: "Manutenção", quantidade: 8, estoqueMinimo: 10 }
];

// Botões e elementos
const btnPesquisar = document.getElementById("btnPesquisar");
const btnSimular = document.getElementById("btnSimular");
const resultadoSimulacao = document.getElementById("simResultado");

const modal = document.getElementById("modalResultados");
const fecharModal = document.getElementById("fecharModal");
const resultadosContainer = document.getElementById("resultadosContainer");

// Pesquisa
btnPesquisar.addEventListener("click", () => {
  const id = document.getElementById("idMaterial").value.trim().toLowerCase();
  const descricao = document.getElementById("descMaterial").value.trim().toLowerCase();
  const centroCusto = document.getElementById("centroCusto").value.trim().toLowerCase();

  const resultados = materiais.filter(mat => {
    const matchId = !id || mat.id.toLowerCase().includes(id);
    const matchDescricao = !descricao || mat.descricao.toLowerCase().includes(descricao);
    const matchCentro = !centroCusto || mat.centroCusto.toLowerCase().includes(centroCusto);
    return matchId && matchDescricao && matchCentro;
  });

  resultadosContainer.innerHTML = "";

  if (resultados.length === 0) {
    resultadosContainer.innerHTML = "<p>Nenhum material encontrado.</p>";
  } else {
    resultados.forEach(mat => {
      const card = document.createElement("div");
      card.className = "card-material";
      card.innerHTML = `
        <p><strong>ID:</strong> ${mat.id}</p>
        <p><strong>Descrição:</strong> ${mat.descricao}</p>
        <p><strong>Centro de Custo:</strong> ${mat.centroCusto}</p>
        <p><strong>Estoque:</strong> ${mat.quantidade}</p>
        <p><strong>Estoque Mínimo:</strong> ${mat.estoqueMinimo}</p>
      `;
      resultadosContainer.appendChild(card);
    });
  }

  modal.classList.remove("hidden");
});

fecharModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Simular consumo
btnSimular.addEventListener("click", () => {
  const codigo = document.getElementById("simCodigo").value.trim().toLowerCase();
  const consumo = Number(document.getElementById("simQuantidade").value);

  if (!codigo) {
    alert("Informe o código da peça para simular.");
    return;
  }
  if (isNaN(consumo) || consumo < 1) {
    alert("Informe uma quantidade válida para consumir.");
    return;
  }

  const peca = materiais.find(p => p.id.toLowerCase() === codigo);

  if (!peca) {
    resultadoSimulacao.textContent = "Peça não encontrada.";
    return;
  }

  const saldo = peca.quantidade - consumo;

  if (saldo < 0) {
    resultadoSimulacao.textContent = `ATENÇÃO! Consumo maior que o estoque atual (${peca.quantidade}). Estoque zerado após consumo.`;
  } else if (saldo <= peca.estoqueMinimo) {
    resultadoSimulacao.textContent = `ATENÇÃO! Estoque ficará baixo após consumo. Saldo previsto: ${saldo}`;
  } else {
    resultadoSimulacao.textContent = `Consumo possível. Saldo previsto: ${saldo}`;
  }
});
