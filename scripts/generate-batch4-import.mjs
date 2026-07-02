import ExcelJS from "exceljs";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
  new URL("../.tmp-batch4-import.xlsx", import.meta.url)
);

const FMJJ = "FMJJ";
const FJJEMG = "FJJEMG - Federação de Jiu Jitsu do Estado de Minas Gerais";

const EVENTS = [
  // FMJJ - 52º Campeonato Mineiro de Jiu-Jitsu (apenas etapas futuras)
  ["2026-07-12", "52º Campeonato Mineiro de Jiu-Jitsu (FMJJ) - 3ª Etapa: Lutadores", FMJJ, "MG", "Belo Horizonte", ""],
  ["2026-09-20", "52º Campeonato Mineiro de Jiu-Jitsu (FMJJ) - 4ª Etapa: Campeões", FMJJ, "MG", "Belo Horizonte", ""],
  ["2026-11-22", "52º Campeonato Mineiro de Jiu-Jitsu (FMJJ) - 5ª Etapa: Invictos", FMJJ, "MG", "Belo Horizonte", ""],
  // FJJEMG
  ["2026-07-05", "Belo Horizonte Minas Open FJJEMG 2026", FJJEMG, "MG", "Belo Horizonte", ""],
  ["2026-07-18", "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 4ª Etapa", FJJEMG, "MG", "Juiz de Fora", ""],
  ["2026-08-02", "Lavras Minas Open FJJEMG 2026", FJJEMG, "MG", "Lavras", ""],
  ["2026-08-16", "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 5ª Etapa", FJJEMG, "MG", "Belo Horizonte", "Mineirinho"],
  ["2026-09-26", "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 6ª Etapa", FJJEMG, "MG", "Juiz de Fora", ""],
  ["2026-10-17", "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 7ª Etapa", FJJEMG, "MG", "Belo Horizonte", ""],
  ["2026-10-25", "Muriaé Minas Open FJJEMG 2026", FJJEMG, "MG", "Muriaé", ""],
  ["2026-11-21", "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 8ª Etapa", FJJEMG, "MG", "Juiz de Fora", ""],
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

for (const [date, name, fed, uf, city, venue] of EVENTS) {
  sheet.addRow([name, fed, date, uf, city, venue, "", "", ""]);
}

await workbook.xlsx.writeFile(outputPath);
console.log(`Gerado ${EVENTS.length} eventos em`, outputPath);
