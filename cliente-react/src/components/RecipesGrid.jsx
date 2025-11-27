import React from "react";

export default function RecipesGrid({ receitas, abrirDetalhes, className }) {
  return (
    <div className={`${className}`}>
      {receitas.map((r) => (
        <div className="card-square shadow-sm" key={r.idMeal}>
          <img src={r.strMealThumb} className="card-img-top" alt={r.strMeal} />
          <div className="card-body">
            <h5 className="card-title">{r.strMeal}</h5>
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={() => abrirDetalhes(r.idMeal)}
            >
              Ver detalhes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
