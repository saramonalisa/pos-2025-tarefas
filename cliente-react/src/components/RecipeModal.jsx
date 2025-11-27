import React from "react";

export default function RecipeModal({ receita, fechar }) {
  if (!receita) return null;

  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const ing = receita[`strIngredient${i}`];
    const med = receita[`strMeasure${i}`];
    if (ing && ing.trim()) ingredientes.push(`${ing} - ${med}`);
  }

  const instrucoes = receita.strInstructions
    .split("\n")
    .filter((l) => l.trim());

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "#0005" }}
      onClick={fechar}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{receita.strMeal}</h5>
            <button className="btn-close" onClick={fechar}></button>
          </div>

          <div className="modal-body">
            <img
              src={receita.strMealThumb}
              className="img-fluid rounded mb-3"
              alt={receita.strMeal}
            />

            <h5 className="fw-bold">Ingredientes</h5>
            <ul>
              {ingredientes.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

            <h5 className="fw-bold mt-3">Instruções</h5>
            <ol>
              {instrucoes.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ol>

            {receita.strYoutube && (
              <a
                href={receita.strYoutube}
                target="_blank"
                className="btn btn-danger btn-sm mt-3"
              >
                Vídeo no YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
