let maquinas = [
  { nome: "Linha 1", status: "Operando" },
  { nome: "Linha 2", status: "Manutenção" },
  { nome: "Linha 3", status: "Operando" },
  { nome: "Linha 4", status: "Operando" },
  { nome: "Linha 5", status: "Operando" },
  { nome: "Linha 6", status: "Parada" },
  { nome: "Linha 7", status: "Manutenção" },
  { nome: "Linha 8", status: "Manutenção" },
  { nome: "Linha 9", status: "Parada" },
];

let historicos = {}; // { "Máquina 1": [{problema, data, hora, registro, manutencao}, ...], ... }

let maquinaSelecionada = null;

function renderMaquinas(filtro = "") {
  const lista = document.getElementById("listaMaquinas");
  lista.innerHTML = "";

  maquinas
    .filter((m) => m.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((m, index) => {
      const card = document.createElement("div");
      card.className = "maquina-card";

      // Corrigir classe para status-indicador
      const statusClass =
        m.status === "Manutenção"
          ? "Manutencao"
          : m.status.replace(/\s/g, "-");

      card.innerHTML = `
        <div class="maquina-info">
          <span class="status-indicador ${statusClass}"></span>
          <span>${m.nome}</span>
        </div>
        <div class="maquina-actions">
          <button onclick="abrirModalFalhasOpcoes(${index})">Falhas</button>
          <button onclick="abrirModalAlterarStatus(${index})">Alterar</button>
        </div>
      `;
      lista.appendChild(card);
    });
}

function abrirModalAlterarStatus(index) {
  maquinaSelecionada = index;
  const status = maquinas[index].status;
  document.getElementById("selectStatus").value = status;
  abrirModal("modalAlterarStatus");
}

function confirmarAlterarStatus() {
  const novoStatus = document.getElementById("selectStatus").value;
  if (maquinaSelecionada !== null) {
    maquinas[maquinaSelecionada].status = novoStatus;
    addHistoricoStatus(maquinaSelecionada, novoStatus);
    fecharModal("modalAlterarStatus");
    renderMaquinas(document.getElementById("buscaMaquina").value);
  }
}

function addHistoricoStatus(index, novoStatus) {
  const nome = maquinas[index].nome;
  if (!historicos[nome]) historicos[nome] = [];
  historicos[nome].push({
    problema: `Status alterado para "${novoStatus}"`,
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    registro: "",
    manutencao: "",
  });
}

function abrirModalFalhasOpcoes(index) {
  maquinaSelecionada = index;
  abrirModal("modalFalhasOpcoes");
}

function abrirModalAdicionarFalha() {
  fecharModal("modalFalhasOpcoes");
  // Reset campos
  document.getElementById("falhaProblema").value = "";
  document.getElementById("falhaData").value = "";
  document.getElementById("falhaHora").value = "";
  document.getElementById("falhaRegistro").value = "";
  document.getElementById("falhaManutencao").value = "";
  abrirModal("modalAdicionarFalha");
}

function confirmarAdicionarFalha() {
  const problema = document.getElementById("falhaProblema").value.trim();
  const data = document.getElementById("falhaData").value;
  const hora = document.getElementById("falhaHora").value;
  const registro = document.getElementById("falhaRegistro").value.trim();
  const manutencao = document.getElementById("falhaManutencao").value.trim();

  if (!problema || !data || !hora || !registro || !manutencao) {
    mostrarAlerta("Preencha todos os campos!", "#dc3545");
    return;
  }

  const nome = maquinas[maquinaSelecionada].nome;
  if (!historicos[nome]) historicos[nome] = [];
  historicos[nome].push({ problema, data, hora, registro, manutencao });

  fecharModal("modalAdicionarFalha");
  mostrarAlerta("Falha registrada com sucesso!");
}

function abrirModalHistoricoFalhas() {
  fecharModal("modalFalhasOpcoes");
  const container = document.getElementById("containerHistoricoFalhas");
  const nome = maquinas[maquinaSelecionada].nome;
  const lista = historicos[nome] || [];

  if (lista.length === 0) {
    container.innerHTML = "<p>Sem histórico de falhas para essa máquina.</p>";
  } else {
    container.innerHTML = lista
      .map(
        (h) => `
      <div class="historico-falha-card">
        <strong>Problema:</strong> ${h.problema}<br/>
        <strong>Data:</strong> ${h.data} ${h.hora}<br/>
        <strong>Registro:</strong> ${h.registro}<br/>
        <strong>Manutenção:</strong> ${h.manutencao}
      </div>
    `
      )
      .join("");
  }

  abrirModal("modalHistoricoFalhas");
}

function abrirModalAdicionarMaquina() {
  document.getElementById("inputNomeMaquina").value = "";
  abrirModal("modalAdicionarMaquina");
}

function confirmarAdicionarMaquina() {
  const nome = document.getElementById("inputNomeMaquina").value.trim();
  if (!nome) {
    mostrarAlerta("Digite o nome da máquina!", "#dc3545");
    return;
  }
  maquinas.push({ nome, status: "Operando" });
  fecharModal("modalAdicionarMaquina");
  renderMaquinas(document.getElementById("buscaMaquina").value);
  mostrarAlerta("Máquina adicionada com sucesso!");
}

function filtrarMaquinas() {
  const filtro = document.getElementById("buscaMaquina").value;
  renderMaquinas(filtro);
}

// Modais genéricos
function abrirModal(id) {
  document.getElementById(id).style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

// Alerta flutuante
function mostrarAlerta(mensagem, cor = "#28a745") {
  const alerta = document.getElementById("alerta");
  alerta.textContent = mensagem;
  alerta.style.background = cor;
  alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 3000);
}

// Inicialização
renderMaquinas();
