document.addEventListener('DOMContentLoaded', () => {
  // Campo Linha customizado
  const selectCustom = document.querySelector('.select-custom');
  const selectSelected = selectCustom.querySelector('.select-selected');
  const selectItems = selectCustom.querySelector('.select-items');
  const hiddenLinhaInput = document.getElementById('linha'); 

  // Popula as opções 1 a 19
  for (let i = 1; i <= 19; i++) {
    const optionDiv = document.createElement('div');
    optionDiv.textContent = i;
    optionDiv.dataset.value = i;
    selectItems.appendChild(optionDiv);
  }

  // Toggle dropdown ao clicar no selecionado
  selectSelected.addEventListener('click', () => {
    selectItems.classList.toggle('select-hide');
    selectSelected.classList.toggle('select-arrow-active');
  });

  // Selecionar uma opção
  selectItems.addEventListener('click', e => {
    if (e.target && e.target.matches('div')) {
      selectSelected.textContent = e.target.textContent;
      hiddenLinhaInput.value = e.target.dataset.value;
      selectItems.classList.add('select-hide');
      selectSelected.classList.remove('select-arrow-active');
    }
  });

  // Fechar dropdown se clicar fora
  document.addEventListener('click', e => {
    if (!selectCustom.contains(e.target)) {
      selectItems.classList.add('select-hide');
      selectSelected.classList.remove('select-arrow-active');
    }
  });

  // Modal elementos
  const modalInspecoes = document.getElementById('modalInspecoes');
  const modalRefugoReparacao = document.getElementById('modalRefugoReparacao');
  const modalProducao = document.getElementById('modalProducao');

  // Botões abrir modais
  const btnInspecoes = document.getElementById('btnInspecoes');
  const btnRefugoReparacao = document.getElementById('btnRefugoReparacao');
  const btnProducao = document.getElementById('btnProducao');

  // Botões fechar modais
  const fecharInspecoes = document.getElementById('fecharInspecoes');
  const fecharRefugoReparacao = document.getElementById('fecharRefugoReparacao');
  const fecharProducao = document.getElementById('fecharProducao');

  // Container inspeções
  const inspecoesContainer = document.getElementById('inspecoesContainer');

  // Resumos na página principal
  const inspecoesResumo = document.getElementById('inspecoesResumo');
  const refugoResumo = document.getElementById('refugoResumo');
  const producaoResumo = document.getElementById('producaoResumo');

  // Variáveis para armazenar dados temporários
  let inspecoes = [];
  let refugos = {};
  let reparacoes = {};
  let producao = {};

  // Função criar input de inspeção
  function criarInputInspecao(value = '') {
    if (inspecoesContainer.children.length >= 8) return; // max 8 inputs
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'inspecao';
    input.placeholder = `Código da inspeção ${inspecoesContainer.children.length + 1}`;
    input.value = value;
    return input;
  }

  // Inicializa com 1 input de inspeção
  inspecoesContainer.appendChild(criarInputInspecao());

  // Adicionar input inspeção
  document.getElementById('addInspecao').addEventListener('click', () => {
    if (inspecoesContainer.children.length >= 8) {
      alert('Máximo de 8 inspeções.');
      return;
    }
    inspecoesContainer.appendChild(criarInputInspecao());
  });

  // Abrir modais
  btnInspecoes.addEventListener('click', () => modalInspecoes.classList.add('active'));
  btnRefugoReparacao.addEventListener('click', () => modalRefugoReparacao.classList.add('active'));
  btnProducao.addEventListener('click', () => modalProducao.classList.add('active'));

  // Fechar modais pelos botões Salvar
  fecharInspecoes.addEventListener('click', () => {
    modalInspecoes.classList.remove('active');
    salvarInspecoes();
  });
  fecharRefugoReparacao.addEventListener('click', () => {
    modalRefugoReparacao.classList.remove('active');
    salvarRefugoReparacao();
  });
  fecharProducao.addEventListener('click', () => {
    modalProducao.classList.remove('active');
    salvarProducao();
  });

  // === FECHAMENTO PELO "X" ===
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.remove('active');
    });
  });

  // Salvar inspeções
  function salvarInspecoes() {
    inspecoes = [];
    inspecoesContainer.querySelectorAll('input[name="inspecao"]').forEach(input => {
      const val = input.value.trim();
      if (val) inspecoes.push(val);
    });
    inspecoesResumo.textContent = inspecoes.length ? `(${inspecoes.length})` : '';
  }

  // Salvar refugo e reparação
  function salvarRefugoReparacao() {
    refugos = {};
    reparacoes = {};
    modalRefugoReparacao.querySelectorAll('.grupo-refugo').forEach(div => {
      const tipo = div.getAttribute('data-tipo');
      const val = Number(div.querySelector('input').value);
      refugos[tipo] = val > 0 ? val : 0;
    });
    modalRefugoReparacao.querySelectorAll('.grupo-reparacao').forEach(div => {
      const tipo = div.getAttribute('data-tipo');
      const val = Number(div.querySelector('input').value);
      reparacoes[tipo] = val > 0 ? val : 0;
    });
    const refugoCount = Object.values(refugos).filter(v => v > 0).length;
    const reparacaoCount = Object.values(reparacoes).filter(v => v > 0).length;
    const total = refugoCount + reparacaoCount;
    refugoResumo.textContent = total ? `(${total})` : '';
  }

  // Salvar produção
  function salvarProducao() {
    const form = modalProducao;
    producao = {
      acumulado: Number(form.querySelector('#acumulado').value) || 0,
      producao: Number(form.querySelector('#producao').value) || 0,
      numDefeitos: Number(form.querySelector('#numDefeitos').value) || 0,
      fracao: Number(form.querySelector('#fracao').value) || 0,
    };
    let resumoTexto = '';
    if (producao.acumulado) resumoTexto += 'Acum ';
    if (producao.producao) resumoTexto += 'Prod ';
    if (producao.numDefeitos) resumoTexto += 'Defeitos ';
    if (producao.fracao) resumoTexto += 'Fração%';
    producaoResumo.textContent = resumoTexto ? `(${resumoTexto.trim()})` : '';
  }

  // Enviar formulário completo
  const formColeta = document.getElementById('formColeta');
  formColeta.addEventListener('submit', e => {
    e.preventDefault();

    if (!formColeta.checkValidity()) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (!hiddenLinhaInput.value) {
      alert('Selecione uma linha válida!');
      return;
    }

    const dados = {
      data: document.getElementById('data').value,
      hora: document.getElementById('hora').value,
      linha: hiddenLinhaInput.value,
      turno: document.getElementById('turno').value,
      teamLeader: document.getElementById('teamLeader').value.trim(),
      operador: document.getElementById('operador').value.trim(),
      fornecedor: document.getElementById('fornecedor').value.trim(),
      inspecoes,
      refugos,
      reparacoes,
      producao
    };

    let dadosSalvos = JSON.parse(localStorage.getItem('dadosProducao')) || [];
    dadosSalvos.push(dados);
    localStorage.setItem('dadosProducao', JSON.stringify(dadosSalvos));

    alert('Dados salvos com sucesso!');

    formColeta.reset();
    hiddenLinhaInput.value = '';
    selectSelected.textContent = 'Selecione a linha';
    inspecoes = [];
    refugos = {};
    reparacoes = {};
    producao = {};
    inspecoesResumo.textContent = '';
    refugoResumo.textContent = '';
    producaoResumo.textContent = '';
    inspecoesContainer.innerHTML = '';
    inspecoesContainer.appendChild(criarInputInspecao());
  });
});
