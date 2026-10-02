import type Lenis from "lenis";

// Instância única do Lenis, registrada pelo SmoothScroll. Fica nula quando o
// usuário pede menos movimento (aí vale o scroll nativo).
let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

/** Rola até a seção pelo Lenis quando ele existe; senão usa o scroll nativo. */
export function scrollToSection(id: string, offset = -64) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  // Leva o foco junto, para teclado e leitor de tela continuarem do ponto certo.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/** Pausa o Lenis enquanto um painel modal (menu mobile) está aberto. */
export function lockSmoothScroll(locked: boolean) {
  if (!lenisInstance) return;
  if (locked) lenisInstance.stop();
  else lenisInstance.start();
}
