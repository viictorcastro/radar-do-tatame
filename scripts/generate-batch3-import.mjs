import ExcelJS from "exceljs";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
  new URL("../.tmp-batch3-import.xlsx", import.meta.url)
);

const CBJJE = "CBJJE";
const CBJJD = "CBJJD";
const FJJ_RIO = "FJJ RIO";

const EVENTS = [
  // CBJJE
  ["2026-08-01", "BJJ Nacional CBJJE 2026", CBJJE, "SP", "São Paulo", ""],
  ["2026-09-19", "BJJ Internacional CBJJE 2026", CBJJE, "SP", "São Bernardo do Campo", ""],
  ["2026-10-23", "Pan-Americano CBJJE 2026", CBJJE, "SP", "São Paulo", ""],
  ["2026-11-26", "Mundial CBJJE 2026 - Juvenil / Adulto / Master", CBJJE, "SP", "São Paulo", ""],
  ["2026-12-04", "Mundial CBJJE 2026 - Kids", CBJJE, "SP", "São Paulo", ""],
  // CBJJD
  ["2026-07-05", "Vitória International Cup", CBJJD, "ES", "Vitória", "Ginásio Tancredão"],
  ["2026-07-18", "Cabo Frio National Open", CBJJD, "RJ", "Cabo Frio", "Ginásio Municipal"],
  ["2026-07-25", "5ª Etapa Brasileiro", CBJJD, "RJ", "Rio de Janeiro", "CEFAN - Centro de Educação Física Almirante Nunes"],
  ["2026-08-22", "Saquarema International Cup", CBJJD, "RJ", "Saquarema", "FAETEC"],
  ["2026-08-29", "6ª Etapa Rio Winter National Open", CBJJD, "RJ", "Rio de Janeiro", "CEFAN - Centro de Educação Física Almirante Nunes"],
  ["2026-09-25", "7ª Etapa Mundial e Mundial Novatos", CBJJD, "RJ", "Cabo Frio", ""],
  ["2026-10-17", "Saquarema Spring National Open", CBJJD, "RJ", "Saquarema", "FAETEC"],
  ["2026-11-14", "8ª Etapa Rio International Cup", CBJJD, "RJ", "Rio de Janeiro", "Velódromo"],
  // FJJ RIO
  ["2026-07-18", "Serrano 2026", FJJ_RIO, "RJ", "Teresópolis", "Ginásio Poliesportivo Pedro Jahara (Pedrão)"],
  ["2026-08-15", "Carlson Gracie 2026", FJJ_RIO, "RJ", "Rio de Janeiro", "Velódromo Olímpico do Rio de Janeiro"],
  ["2026-09-19", "Carioca 2026", FJJ_RIO, "RJ", "Rio de Janeiro", "Clube Municipal"],
  ["2026-10-24", "Rei do Rio 2026", FJJ_RIO, "RJ", "Rio de Janeiro", "Arena Carioca 1"],
  ["2026-12-05", "Rolls Gracie 2026", FJJ_RIO, "RJ", "Rio de Janeiro", "Arena Carioca 1"],
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
