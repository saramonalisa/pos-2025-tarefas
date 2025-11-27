import React from "react";

export default function Sidebar({ categorias, categoriaAtual, setCategoria, className }) {
  return (
    <aside className={`pt-3 ${className}`}>
      <h5 className="fw-bold">Categorias</h5>
      <ul className="list-unstyled">
        <li
          className={categoriaAtual === "" ? "fw-bold active" : ""}
          onClick={() => setCategoria("")}
        >
          Todas
        </li>
        {categorias.map((c) => (
          <li
            key={c.idCategory}
            className={categoriaAtual === c.strCategory ? "fw-bold active" : ""}
            onClick={() => setCategoria(c.strCategory)}
          >
            {c.strCategory}
          </li>
        ))}
      </ul>
    </aside>
  );
}
