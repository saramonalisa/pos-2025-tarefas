import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CategoriesGrid from "./components/CategoriesGrid";
import RecipesGrid from "./components/RecipesGrid";
import Pagination from "./components/Pagination";
import RecipeModal from "./components/RecipeModal";

export default function App() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState("");
  const [receitas, setReceitas] = useState([]);
  const [receitasFiltradas, setReceitasFiltradas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchIngredient, setSearchIngredient] = useState("");
  const [modalReceita, setModalReceita] = useState(null);

  const porPagina = 8;
  const cacheDetalhes = new Map();

  useEffect(() => {
    async function fetchCategorias() {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await res.json();
      setCategorias(data.categories || []);
    }
    fetchCategorias();
  }, []);

  async function buscarReceitas(cat) {
    setCategoriaAtual(cat);
    setSearchName("");
    setSearchIngredient("");

    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
    );
    const data = await res.json();
    setReceitas(data.meals || []);
    setReceitasFiltradas(data.meals || []);
    setPaginaAtual(1);
  }

  async function obterDetalhes(id) {
    if (cacheDetalhes.has(id)) return cacheDetalhes.get(id);

    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    const meal = data.meals[0];

    cacheDetalhes.set(id, meal);
    return meal;
  }

  useEffect(() => {
    async function aplicarPesquisa() {
      let filtrado = receitas;

      if (searchName) {
        filtrado = filtrado.filter((r) =>
          r.strMeal.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      if (searchIngredient) {
        const temp = [];
        for (const r of filtrado) {
          const detalhes = await obterDetalhes(r.idMeal);
          for (let i = 1; i <= 20; i++) {
            const ing = detalhes[`strIngredient${i}`];
            if (ing && ing.toLowerCase().includes(searchIngredient.toLowerCase())) {
              temp.push(r);
              break;
            }
          }
        }
        filtrado = temp;
      }

      setReceitasFiltradas(filtrado);
      setPaginaAtual(1);
    }

    aplicarPesquisa();
  }, [searchName, searchIngredient, receitas]);

  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;
  const paginaReceitas = receitasFiltradas.slice(inicio, fim);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2">
          <Sidebar
            className="sidebar"
            categorias={categorias}
            categoriaAtual={categoriaAtual}
            setCategoria={buscarReceitas}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="col-md-10 main-content">
          <div className="text-center mb-2">
            <h1 className="fw-bold d-inline-flex align-items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="50"
                height="50"
                fill="currentColor"
                className="text-danger"
              >
                <path d="M15,8H17c0.6,0,1-0.4,1-1s-0.4-1-1-1H15c-0.6,0-1,0.4-1,1S14.4,8,15,8z"/>
                <path d="M29.9,20.5C29.7,20.2,29.3,20,29,20h-1.1c-0.5-4.4-4.1-8.8-8.7-10.2c-2.1-0.7-4.4-0.7-6.5,0C8.2,11.2,4.5,15.6,4.1,20H3c-0.3,0-0.7,0.2-0.9,0.5s-0.2,0.7,0,1C3.5,24.3,6.3,26,9.5,26h13.1c3.1,0,6-1.7,7.4-4.6C30,21.1,30,20.8,29.9,20.5z M13.3,11.7c1.7-0.5,3.6-0.5,5.3,0c3.7,1.1,6.8,4.7,7.3,8.3H6.1C6.6,16.4,9.6,12.9,13.3,11.7z M22.5,24H9.5c-1.8,0-3.4-0.7-4.6-2h22.2C25.9,23.3,24.3,24,22.5,24z"/>
              </svg>
              TheMealDB
            </h1>
          </div>

          {/* Inputs de pesquisa */}
          <div className="search-container d-flex gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Pesquisar por nome..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              disabled={!categoriaAtual}
            />
            <input
              className="form-control"
              placeholder="Pesquisar por ingrediente..."
              value={searchIngredient}
              onChange={(e) => setSearchIngredient(e.target.value)}
              disabled={!categoriaAtual}
            />
          </div>

          {/* Grid de categorias ou receitas */}
          {!categoriaAtual ? (
            <CategoriesGrid
              className="categories-grid"
              categorias={categorias}
              abrir={buscarReceitas}
            />
          ) : (
            <>
              <Pagination
                className="pagination-container"
                total={receitasFiltradas.length}
                porPagina={porPagina}
                paginaAtual={paginaAtual}
                mudar={setPaginaAtual}
              />
              <RecipesGrid
                className="recipes-grid"
                receitas={paginaReceitas}
                abrirDetalhes={async (id) => {
                  const det = await obterDetalhes(id);
                  setModalReceita(det);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <RecipeModal receita={modalReceita} fechar={() => setModalReceita(null)} />
    </div>
  );
}
