let hoje = new Date();
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();

let manutencoes = [];

const meses = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

function alterarMes(inc) {
  mesAtual += inc;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  } else if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  renderCalendar();
  limparListaManutencoes();
}

function renderCalendar() {
  const monthYear = document.getElementById("monthYear");
  const diasContainer = document.getElementById("dias");

  monthYear.textContent = `${meses[mesAtual]} ${anoAtual}`;

  diasContainer.innerHTML = "";

  const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);
  const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);

  const diaSemanaPrimeiro = primeiroDiaMes.getDay(); // 0=Dom, 6=Sab
  const totalDias = ultimoDiaMes.getDate();

  // Espaços em branco antes do 1º dia do mês
  for (let i = 0; i < diaSemanaPrimeiro; i++) {
    const span = document.createElement("div");
    diasContainer.appendChild(span);
  }

  // Dias do mês
  for (let dia = 1; dia <= totalDias; dia++) {
    const divDia = document.createElement("div");
    divDia.classList.add("dia");
    divDia.textContent = dia;

    // Checa se tem manutenção na data
    const dataStr = formatarData(new Date(anoAtual, mesAtual, dia));
    const temManutencao = manutencoes.some(m => m.data === dataStr);

    if (temManutencao) {
      divDia.classList.add("ativo");
      const badge = document.createElement("div");
      badge.classList.add("badge");
      divDia.appendChild(badge);
    }

    divDia.addEventListener("click", () => {
      mostrarManutencoesDoDia(dataStr);
      marcarDiaAtivo(dia);
    });

    diasContainer.appendChild(divDia);
  }
}

function marcarDiaAtivo(dia) {
  const dias = document.querySelectorAll(".dia");
  dias.forEach(d => {
    d.classList.remove("ativo");
  });
  const diasContainer = document.getElementById("dias");
  const index = [...diasContainer.children].findIndex(el => el.textContent == dia);
  if (index >= 0) {
    diasContainer.children[index].classList.add("ativo");
  }
}

function formatarData(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function mostrarManutencoesDoDia(dataStr) {
  const lista = document.getElementById("listaManutencoes");
  lista.innerHTML = "";

  const manutencoesDoDia = manutencoes.filter(m => m.data === dataStr);

  if (manutencoesDoDia.length === 0) {
    lista.innerHTML = `<li>Nenhuma manutenção agendada para esta data.</li>`;
    return;
  }

  manutencoesDoDia.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m.descricao;
    lista.appendChild(li);
  });
}

function abrirModal() {
  document.getElementById("modalManutencao").style.display = "flex";
  limparCamposModal();
}

function fecharModal() {
  document.getElementById("modalManutencao").style.display = "none";
}

function limparCamposModal() {
  document.getElementById("inputData").value = "";
  document.getElementById("inputDescricao").value = "";
}

function salvarManutencao() {
  const data = document.getElementById("inputData").value;
  const descricao = document.getElementById("inputDescricao").value.trim();

  if (!data) {
    alert("Por favor, escolha uma data.");
    return;
  }
  if (!descricao) {
    alert("Por favor, descreva a manutenção.");
    return;
  }

  manutencoes.push({ data, descricao });

  fecharModal();
  renderCalendar();
  mostrarManutencoesDoDia(data);
}

document.getElementById("btnAdicionarManutencao").addEventListener("click", abrirModal);
document.getElementById("btnFecharModal").addEventListener("click", fecharModal);
document.getElementById("btnSalvarManutencao").addEventListener("click", salvarManutencao);

// Inicialização
renderCalendar();
limparListaManutencoes();

function limparListaManutencoes() {
  const lista = document.getElementById("listaManutencoes");
  lista.innerHTML = `<li>Selecione uma data para ver as manutenções agendadas.</li>`;
}
