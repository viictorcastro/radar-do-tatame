import ExcelJS from "exceljs";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
  new URL("../.tmp-cbjjo-import.xlsx", import.meta.url)
);

const FEDERATION = "CBJJO - Confederação Brasileira de Jiu-Jitsu Olímpico";

const EVENTS = [
  ["2026-07-04", "Mundial CBJJO 2026", "RJ", "Rio de Janeiro", "Arena da Barra"],
  ["2026-08-08", "Mundial Feminino CBJJO 2026", "RJ", "Rio de Janeiro", "Urca"],
  ["2026-09-12", "Panamericano CBJJO 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-10-03", "Maricá Golden Cup CBJJO 2026", "RJ", "Maricá", ""],
  ["2026-11-07", "World Cup CBJJO 2026", "RJ", "Rio de Janeiro", "Arena da Barra"],
];

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Campeonatos");
sheet.addRow([
  "Nome do Campeonato",
  "Federação",
  "Data (AAAA-MM-DD)",
  "Estado (UF)",
  "Cidade",
  "Local",
  "Latitude",
  "Longitude",
  "Link do evento",
]);

for (const [date, name, uf, city, venue] of EVENTS) {
  sheet.addRow([name, FEDERATION, date, uf, city, venue, "", "", ""]);
}

await workbook.xlsx.writeFile(outputPath);
console.log(`Gerado ${EVENTS.length} eventos em`, outputPath);
