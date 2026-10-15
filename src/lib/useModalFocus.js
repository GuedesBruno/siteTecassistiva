'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Gerencia o foco de um diálogo modal: foco inicial dentro do diálogo, trap do Tab,
// fechamento com Esc e retorno do foco ao elemento que abriu o diálogo.
// iframes ficam fora do trap (o foco dentro deles não gera keydown aqui): quem usa iframe deve
// colocar uma sentinela focável depois dele que devolva o foco ao diálogo (ver VideoModal).
// Foco inicial: elemento com data-autofocus, se houver; senão o primeiro focável.
// Uso: const dialogRef = useModalFocus(isOpen, onClose); <div ref={dialogRef} tabIndex={-1} role="dialog" ...>
export function useModalFocus(isOpen, onClose) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;

    // Foco inicial: primeiro elemento focável (botão de fechar) ou o próprio diálogo
    const first = dialog?.querySelector('[data-autofocus]') || dialog?.querySelector(FOCUSABLE);
    (first || dialog)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === firstEl || document.activeElement === dialog)) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  return dialogRef;
}
