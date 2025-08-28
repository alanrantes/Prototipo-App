// Dados fictícios
const piecesDatabase = [
  {
    DrawingNumber: 1,
    PieceName: 'PEÇA EXEMPLO',
    MaterialType: 'FEPO4',
    Thickness: 0.75,
    Width: 1310,
    Length: 1900,
    BlankNumber: 6325128628,
    Line: 7
  }
];

// Busca peça pelo número do desenho
function searchPiece() {
  const searchNumber = document.getElementById('searchNumber').value;
  const piece = piecesDatabase.find(p => p.DrawingNumber == searchNumber);

  if (piece) {
    document.getElementById('drawingNumber').value = piece.DrawingNumber;
    document.getElementById('pieceName').value = piece.PieceName;
    document.getElementById('line').value = piece.Line;
    document.getElementById('materialType').value = piece.MaterialType;
    document.getElementById('thickness').value = piece.Thickness;
    document.getElementById('width').value = piece.Width;
    document.getElementById('length').value = piece.Length;
  } else {
    alert('Peça não encontrada.');
  }
}

// Reseta inputs da proposta
function resetValues() {
  const ids = [
    'reductionLength',
    'reductionThickness',
    'reductionWidth',
    'materialAlteration',
    'amountParts',
    'pricePerKg'
  ];
  ids.forEach(id => document.getElementById(id).value = '');
}

// Calcula proposta e exibe resultado
function calculate() {
  const amountPartsInput = document.getElementById('amountParts');
  const pricePerKgInput = document.getElementById('pricePerKg');

  const width = parseFloat(document.getElementById('width').value);
  const length = parseFloat(document.getElementById('length').value);
  const thickness = parseFloat(document.getElementById('thickness').value);

  // Resetar classes de erro
  amountPartsInput.classList.remove('input-error');
  pricePerKgInput.classList.remove('input-error');

  const pricePerKg = parseFloat(pricePerKgInput.value);
  const amountParts = parseInt(amountPartsInput.value, 10);

  let valid = true;

  if (isNaN(amountParts)) {
    amountPartsInput.classList.add('input-error');
    valid = false;
  }

  if (isNaN(pricePerKg)) {
    pricePerKgInput.classList.add('input-error');
    valid = false;
  }

  if (!valid) {
    return;
  }

  const reductionWidth = parseFloat(document.getElementById('reductionWidth').value) || 0;
  const reductionLength = parseFloat(document.getElementById('reductionLength').value) || 0;
  const reductionThickness = parseFloat(document.getElementById('reductionThickness').value) || 0;

  const weightCurrent = (thickness * width * length) / 1000000 * 7.85;
  const weightProposed = ((thickness - reductionThickness) * (width - reductionWidth) * (length - reductionLength)) / 1000000 * 7.85;
  const weightDifference = weightCurrent - weightProposed;
  const cost = Math.round(weightDifference * pricePerKg * amountParts * 100) / 100;

  const resultsHTML = `
    <p><strong>Largura:</strong> ${width - reductionWidth} mm</p>
    <p><strong>Comprimento:</strong> ${length - reductionLength} mm</p>
    <p><strong>Espessura:</strong> ${thickness - reductionThickness} mm</p>
    <p><strong>Peso Atual:</strong> ${weightCurrent.toFixed(2)} kg</p>
    <p><strong>Peso Proposto:</strong> ${weightProposed.toFixed(2)} kg</p>
    <p><strong>Diferença de Peso:</strong> ${weightDifference.toFixed(2)} kg</p>
    <p><strong>Custo Total:</strong> R$ ${cost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  `;

  document.getElementById('resultsContent').innerHTML = resultsHTML;
  document.getElementById('resultsModal').style.display = 'flex';
}



// Fecha modal de resultado
function closeResultsModal() {
  document.getElementById('resultsModal').style.display = 'none';
}

// Abre modal da proposta
function abrirModalProposta() {
  document.getElementById('modalProposta').style.display = 'flex';
}

// Fecha modal da proposta
function fecharModalProposta() {
  document.getElementById('modalProposta').style.display = 'none';
}
