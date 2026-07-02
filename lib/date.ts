/**
 * As datas de campeonato representam um dia do calendário, não um instante
 * exato. Elas são armazenadas/serializadas em UTC (ex.: "2026-07-07T00:00:00Z").
 * Ler esse valor com `new Date(...)` e depois formatar com `toLocaleDateString`
 * converte para o fuso horário local, o que pode "voltar" um dia inteiro para
 * fusos atrás de UTC (como o Brasil). Esta função reinterpreta os componentes
 * de data em UTC como se fossem o dia local correto, evitando esse desvio.
 */
export function toCalendarDate(value: string | Date): Date {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

// Brasília é UTC-3 o ano inteiro desde que o Brasil aboliu o horário de
// verão em 2019, então o deslocamento fixo abaixo é seguro (sem DST a
// considerar).
const BRASILIA_OFFSET_MS = 3 * 60 * 60 * 1000;

function brasiliaNow(): Date {
  return new Date(Date.now() - BRASILIA_OFFSET_MS);
}

/**
 * "Hoje" segundo o horário de Brasília, como um Date de meia-noite local
 * (mesma convenção de `toCalendarDate`) — comparável por subtração com
 * datas retornadas por `toCalendarDate`, independente do fuso do
 * navegador de quem está vendo a página.
 */
export function brasiliaToday(): Date {
  const b = brasiliaNow();
  return new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
}

/**
 * O mesmo "hoje" de Brasília, mas como instante UTC de meia-noite — no
 * mesmo formato em que as datas de campeonato são armazenadas/serializadas,
 * para uso em filtros de banco de dados (`gte`/`lt`).
 */
export function brasiliaTodayUTC(): Date {
  const b = brasiliaNow();
  return new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()));
}
