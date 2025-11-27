import React from "react";

export default function CategoriesGrid({ categorias, abrir, className }) {
  return (
    <div className={className}>
      {categorias.map((cat) => (
        <div key={cat.idCategory} className="card-square shadow-sm">
          <img src={cat.strCategoryThumb} alt={cat.strCategory} className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title">{cat.strCategory}</h5>
            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => abrir(cat.strCategory)}
            >
              Ver receitas
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
