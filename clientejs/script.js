const categoriaList = document.getElementById('categoriaList');
const categoriasContainer = document.getElementById('categoriasContainer');
const receitasContainer = document.getElementById('receitasContainer');
const detalhesReceita = document.getElementById('detalhesReceita');
const detalhesTitulo = document.getElementById('detalhesReceitaModalLabel');
const searchName = document.getElementById('searchName');
const searchIngredient = document.getElementById('searchIngredient');
const paginationContainer = document.getElementById('pagination');

let categorias = [];
let receitas = [];
let receitasFiltradas = [];
let categoriaAtual = null;
let paginaAtual = 1;
const porPagina = 8;

const cacheReceitasDetalhes = new Map();

async function carregarCategorias() {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await res.json();
    categorias = data.categories;

    categorias.forEach(cat => {
      const li = document.createElement('li');
      li.dataset.category = cat.strCategory;
      li.textContent = cat.strCategory;
      categoriaList.appendChild(li);
    });

    categoriaList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', async () => {
        categoriaList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');

        if (!li.dataset.category) {
          categoriaAtual = null;
          mostrarCategorias();
          searchName.disabled = true;
          searchIngredient.disabled = true;
        } else {
          categoriaAtual = li.dataset.category;
          await buscarReceitas(categoriaAtual);
          searchName.disabled = false;
          searchIngredient.disabled = false;
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
        <div class="card-body d-flex flex-column justify-content-between">
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
      categoriaList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
      const li = Array.from(categoriaList.children).find(l => l.dataset.category === categoriaAtual);
      if (li) li.classList.add('active');
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
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`);
    const data = await res.json();
    receitas = data.meals || [];
    receitasFiltradas = [...receitas];
    paginaAtual = 1;
    renderizarPagina();
  } catch (err) {
    console.error(err);
    receitasContainer.innerHTML = '<p class="text-danger">Erro ao carregar receitas.</p>';
  }
}

async function obterDetalhesReceita(id) {
  if (cacheReceitasDetalhes.has(id)) return cacheReceitasDetalhes.get(id);
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];
  cacheReceitasDetalhes.set(id, meal);
  return meal;
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
        <div class="card-body d-flex flex-column justify-content-between">
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

function adicionarEventosDetalhes() {
  receitasContainer.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try {
        const receita = await obterDetalhesReceita(id);
        detalhesTitulo.textContent = receita.strMeal;

        let ingredientesCol1 = '';
        let ingredientesCol2 = '';
        let alternar = true;

        for (let i = 1; i <= 20; i++) {
          const ing = receita[`strIngredient${i}`];
          const med = receita[`strMeasure${i}`];
          if (ing && ing.trim()) {
            const item = `<li>${ing} - ${med}</li>`;
            if (alternar) {
              ingredientesCol1 += item;
            } else {
              ingredientesCol2 += item;
            }
            alternar = !alternar;
          }
        }

        const ingredientesHTML = `
          <div class="row">
            <div class="col-md-6"><ul>${ingredientesCol1}</ul></div>
            <div class="col-md-6"><ul>${ingredientesCol2}</ul></div>
          </div>
        `;

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
          ${ingredientesHTML}
          <h5 class="fw-bold">Instruções:</h5>
          <ol>${instrucoes}</ol>
          <p><strong>Categoria:</strong> ${receita.strCategory}</p>
          <p><strong>Área:</strong> ${receita.strArea}</p>
          ${
            receita.strYoutube
              ? `<p><a href="${receita.strYoutube}" target="_blank" class="btn btn-danger btn-sm">
                  <i class="bi bi-youtube"></i> Vídeo no YouTube
                </a></p>`
              : ''
          }
        `;
      } catch {
        detalhesReceita.innerHTML = '<p class="text-danger">Erro ao carregar detalhes da receita.</p>';
      }
    });
  });
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

async function aplicarPesquisa() {
  const nome = searchName.value.toLowerCase();
  const ingrediente = searchIngredient.value.toLowerCase();

  receitasFiltradas = receitas.filter(r => !nome || r.strMeal.toLowerCase().includes(nome));

  if (ingrediente) {
    const detalhesPromises = receitasFiltradas.map(async r => {
      const meal = await obterDetalhesReceita(r.idMeal);
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

searchName.addEventListener('input', aplicarPesquisa);
searchIngredient.addEventListener('input', aplicarPesquisa);

carregarCategorias();
