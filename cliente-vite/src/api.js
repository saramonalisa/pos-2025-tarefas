const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const cacheReceitasDetalhes = new Map();

export async function getCategorias() {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories;
}

export async function getReceitasPorCategoria(categoria) {
  const res = await fetch(`${BASE_URL}/filter.php?c=${categoria}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getDetalhesReceita(id) {
  if (cacheReceitasDetalhes.has(id)) {
    return cacheReceitasDetalhes.get(id);
  }

  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];
  cacheReceitasDetalhes.set(id, meal);
  return meal;
}
