import ExcelJS from "exceljs";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
  new URL("../public/templates/modelo-campeonatos.xlsx", import.meta.url)
);
mkdirSync(dirname(outputPath), { recursive: true });

const workbook = new ExcelJS.Workbook();

const sheet = workbook.addWorksheet("Campeonatos");
const headers = [
  "Nome do Campeonato",
  "Federação",
  "Data (AAAA-MM-DD)",
  "Estado (UF)",
  "Cidade",
  "Local",
  "Latitude (opcional)",
  "Longitude (opcional)",
  "Link do evento",
];

sheet.addRow(headers);
sheet.getRow(1).eachCell((cell) => {
  cell.font = { bold: true, name: "Arial" };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFDCE6F1" },
  };
});

sheet.addRow([
  "Copa Sorocaba de Jiu-Jitsu",
  "Federação Paulista de Jiu-Jitsu",
  "2026-09-20",
  "SP",
  "Sorocaba",
  "Ginásio Municipal de Sorocaba",
  -23.5015,
  -47.4526,
  "https://exemplo.com/evento",
]);
sheet.addRow([
  "Copa Vitória de Jiu-Jitsu",
  "CBJJ - Confederação Brasileira de Jiu-Jitsu",
  "2026-10-11",
  "ES",
  "Vitória",
  "Ginásio Municipal de Vitória",
  "",
  "",
  "https://exemplo.com/evento",
]);

sheet.columns = [
  { width: 32 },
  { width: 36 },
  { width: 20 },
  { width: 14 },
  { width: 20 },
  { width: 30 },
  { width: 12 },
  { width: 12 },
  { width: 30 },
];
sheet.eachRow((row) => row.eachCell((cell) => (cell.font = { ...(cell.font ?? {}), name: "Arial" })));

const instructions = workbook.addWorksheet("Instruções");
instructions.columns = [{ width: 90 }];
const lines = [
  "Como preencher esta planilha",
  "",
  "1. Preencha uma linha por campeonato na aba \"Campeonatos\", sem apagar a linha de cabeçalho.",
  "2. Campos obrigatórios: Nome do Campeonato, Federação, Data, Estado (UF), Cidade.",
  "3. Local, Latitude, Longitude e Link do evento são opcionais.",
  "4. A Data deve estar no formato AAAA-MM-DD (exemplo: 2026-09-20).",
  "5. O Estado deve ser a sigla de 2 letras (exemplo: SP, RJ, MG).",
  "6. Se a Federação informada ainda não existir no sistema, ela será criada automaticamente.",
  "7. Linhas com o mesmo Nome + Data + Cidade de um campeonato já cadastrado serão puladas automaticamente para evitar duplicidade.",
  "8. Se você deixar Latitude e Longitude em branco, o sistema tenta descobrir automaticamente a partir da Cidade/Estado. Se preferir informar manualmente, pesquise o endereço no Google Maps, clique com o botão direito no local e copie as coordenadas.",
];
lines.forEach((text, index) => {
  const row = instructions.addRow([text]);
  if (index === 0) row.getCell(1).font = { bold: true, size: 14, name: "Arial" };
  else row.getCell(1).font = { name: "Arial" };
});

await workbook.xlsx.writeFile(outputPath);
console.log("Modelo gerado em", outputPath);
