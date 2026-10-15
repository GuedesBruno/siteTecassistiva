// Navegação por teclado em abas (padrão WAI-ARIA): setas, Home e End.
// ids: lista de ids lógicos das abas; elementId(id): id do elemento <button role="tab"> no DOM.
export function handleTablistKeyDown(event, ids, currentId, onSelect, elementId) {
  const index = ids.indexOf(currentId);
  if (index === -1) return;

  let next = null;
  if (event.key === 'ArrowRight') next = ids[(index + 1) % ids.length];
  else if (event.key === 'ArrowLeft') next = ids[(index - 1 + ids.length) % ids.length];
  else if (event.key === 'Home') next = ids[0];
  else if (event.key === 'End') next = ids[ids.length - 1];
  if (next === null) return;

  event.preventDefault();
  onSelect(next);
  document.getElementById(elementId(next))?.focus();
}
