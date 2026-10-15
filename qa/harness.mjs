// Mini harness sem dependências. Uso: const t = suite('nome'); t.test('x', fn); await t.run();
import assert from 'node:assert/strict';
export { assert };

export function suite(name) {
  const cases = [];
  return {
    test: (title, fn) => cases.push({ title, fn, known: false }),
    // Defeito conhecido: o teste descreve o comportamento DESEJADO e hoje falha.
    // Se falhar => "DEFEITO CONFIRMADO" (não derruba o exit code). Se passar => avisa que foi corrigido.
    defect: (title, fn) => cases.push({ title, fn, known: true }),
    async run() {
      let pass = 0, fail = 0, defects = 0, fixed = 0;
      console.log(`\n# ${name}`);
      for (const c of cases) {
        try {
          await c.fn();
          if (c.known) { fixed++; console.log(`  CORRIGIDO? ${c.title} (esperava falhar)`); }
          else { pass++; console.log(`  ok   ${c.title}`); }
        } catch (e) {
          if (c.known) { defects++; console.log(`  DEFEITO CONFIRMADO  ${c.title}\n       -> ${String(e.message).split('\n')[0]}`); }
          else { fail++; console.log(`  FALHA ${c.title}\n       -> ${e.message}`); }
        }
      }
      console.log(`  resumo: ${pass} ok, ${fail} falhas, ${defects} defeitos confirmados, ${fixed} defeitos aparentemente corrigidos`);
      return fail;
    },
  };
}
