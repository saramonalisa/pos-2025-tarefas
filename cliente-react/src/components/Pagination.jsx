import React from "react";

export default function Pagination({ total, porPagina, paginaAtual, mudar, className }) {
  const totalPaginas = Math.ceil(total / porPagina);
  if (!totalPaginas) return null;

  return (
    <div className={className}>
      {Array.from({ length: totalPaginas }, (_, i) => (
        <button
          key={i}
          className={`btn btn-sm btn-outline-primary ${paginaAtual === i + 1 ? "active" : ""}`}
          onClick={() => mudar(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
