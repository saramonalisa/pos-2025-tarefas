import { getCategorias, getReceitasPorCategoria, getDetalhesReceita } from './api.js';

let categorias = [];
let receitas = [];
let receitasFiltradas = [];
let categoriaAtual = null;
let paginaAtual = 1;
const porPagina = 8;

let categoriaList, categoriasContainer, receitasContainer, detalhesReceita, detalhesTitulo, searchName, searchIngredient, paginationContainer;

export function inicializarElementos() {
  categoriaList = document.getElementById('categoriaList');
  categoriasContainer = document.getElementById('categoriasContainer');
  receitasContainer = document.getElementById('receitasContainer');
  detalhesReceita = document.getElementById('detalhesReceita');
  detalhesTitulo = document.getElementById('detalhesReceitaModalLabel');
  searchName = document.getElementById('searchName');
  searchIngredient = document.getElementById('searchIngredient');
  paginationContainer = document.getElementById('pagination');
}

export async function carregarCategorias() {
  try {
    categorias = await getCategorias();

    categorias.forEach(cat => {
      if (!categoriaList.querySelector(`[data-category="${cat.strCategory}"]`)) {
        const li = document.createElement('li');
        li.dataset.category = cat.strCategory;
        li.textContent = cat.strCategory;
        categoriaList.appendChild(li);
      }
    });

    categoriaList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', async () => {
        categoriaList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');

        categoriaAtual = li.dataset.category || null;

        if (categoriaAtual) {
          await buscarReceitas(categoriaAtual);
          searchName.disabled = false;
          searchIngredient.disabled = false;
        } else {
          mostrarCategorias();
          searchName.disabled = true;
          searchIngredient.disabled = true;
        }

        searchName.value = '';
        searchIngredient.value = '';
      });
    });

    mostrarCategorias();
    searchName.disabled = true;
    searchIngredient.disabled = true;

  } catch (err) {
    console.error('Erro ao carregar categorias', err);
  }
}

function mostrarCategorias() {
  categoriasContainer.innerHTML = '';
  receitasContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  categorias.forEach(cat => {
    const col = document.createElement('div');
    col.innerHTML = `
      <div class="card card-square shadow-sm">
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
        <div class="card-body">
          <h5 class="card-title">${cat.strCategory}</h5>
          <button class="btn btn-primary btn-sm mt-2" data-category="${cat.strCategory}">Ver Receitas</button>
        </div>
      </div>
    `;
    categoriasContainer.appendChild(col);
  });

  categoriasContainer.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      categoriaAtual = btn.dataset.category;
      await buscarReceitas(categoriaAtual);
      searchName.disabled = false;
      searchIngredient.disabled = false;
      searchName.value = '';
      searchIngredient.value = '';
    });
  });
}

async function buscarReceitas(categoria) {
  categoriasContainer.innerHTML = '';
  receitasContainer.innerHTML = '<p class="text-muted">Carregando...</p>';
  try {
    receitas = await getReceitasPorCategoria(categoria);
    receitasFiltradas = [...receitas];
    paginaAtual = 1;
    renderizarPagina();
  } catch (err) {
    console.error(err);
    receitasContainer.innerHTML = '<p class="text-danger">Erro ao carregar receitas.</p>';
  }
}

function renderizarPagina() {
  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;
  const paginaReceitas = receitasFiltradas.slice(inicio, fim);

  receitasContainer.innerHTML = '';

  paginaReceitas.forEach(receita => {
    const col = document.createElement('div');
    col.innerHTML = `
      <div class="card card-square shadow-sm">
        <img src="${receita.strMealThumb}" alt="${receita.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${receita.strMeal}</h5>
          <button class="btn btn-primary btn-sm mt-2" data-id="${receita.idMeal}" data-bs-toggle="modal" data-bs-target="#detalhesReceitaModal">
            Ver Detalhes
          </button>
        </div>
      </div>
    `;
    receitasContainer.appendChild(col);
  });

  renderizarPaginacao();
  adicionarEventosDetalhes();
}

function renderizarPaginacao() {
  const totalPaginas = Math.ceil(receitasFiltradas.length / porPagina);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'btn btn-outline-primary btn-sm';
    if (i === paginaAtual) btn.classList.add('active');
    btn.addEventListener('click', () => {
      paginaAtual = i;
      renderizarPagina();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationContainer.appendChild(btn);
  }
}

function adicionarEventosDetalhes() {
  receitasContainer.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try {
        const receita = await getDetalhesReceita(id);
        exibirDetalhes(receita);
      } catch {
        detalhesReceita.innerHTML = '<p class="text-danger">Erro ao carregar detalhes da receita.</p>';
      }
    });
  });
}

function exibirDetalhes(receita) {
  detalhesTitulo.textContent = receita.strMeal;

  let ingredientesCol1 = '';
  let ingredientesCol2 = '';
  let alternar = true;

  for (let i = 1; i <= 20; i++) {
    const ing = receita[`strIngredient${i}`];
    const med = receita[`strMeasure${i}`];
    if (ing && ing.trim()) {
      const item = `<li>${ing} - ${med}</li>`;
      if (alternar) ingredientesCol1 += item;
      else ingredientesCol2 += item;
      alternar = !alternar;
    }
  }

  const instrucoes = receita.strInstructions
    .split(/\r?\n/)
    .filter(l => l.trim() !== '')
    .map(l => `<li>${l.trim()}</li>`)
    .join('');

  detalhesReceita.innerHTML = `
    <div class="text-center mb-3">
      <img src="${receita.strMealThumb}" class="img-fluid rounded" alt="${receita.strMeal}" style="max-height: 200px; object-fit: cover;">
    </div>
    <h5 class="fw-bold">Ingredientes:</h5>
    <div class="row">
      <div class="col-md-6"><ul>${ingredientesCol1}</ul></div>
      <div class="col-md-6"><ul>${ingredientesCol2}</ul></div>
    </div>
    <h5 class="fw-bold">Instruções:</h5>
    <ol>${instrucoes}</ol>
  `;
}

export function configurarPesquisa() {
  searchName.addEventListener('input', aplicarPesquisa);
  searchIngredient.addEventListener('input', aplicarPesquisa);
}

async function aplicarPesquisa() {
  const nome = searchName.value.toLowerCase();
  const ingrediente = searchIngredient.value.toLowerCase();

  receitasFiltradas = receitas.filter(r => !nome || r.strMeal.toLowerCase().includes(nome));

  if (ingrediente) {
    const detalhesPromises = receitasFiltradas.map(async r => {
      const meal = await getDetalhesReceita(r.idMeal);
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.toLowerCase().includes(ingrediente)) return r;
      }
      return null;
    });
    const resultados = await Promise.all(detalhesPromises);
    receitasFiltradas = resultados.filter(r => r !== null);
  }

  paginaAtual = 1;
  renderizarPagina();
}
