// Sentinelas do VideoModal (uma antes e outra depois do iframe, ambas focáveis).
// Regra única: se o foco chegou vindo do botão Fechar (Tab ou Shift+Tab com o trap do useModalFocus),
// entra no player; em qualquer outro caso (relatedTarget nulo = saiu do iframe) volta ao botão Fechar.
// Assim Shift+Tab a partir do Fechar alcança o player e sair do player nunca vaza para a página.
export function sentinelFocusTarget(relatedTarget, closeButton) {
  return closeButton && relatedTarget === closeButton ? 'player' : 'close';
}
