import ExcelJS from "exceljs";
import { fileURLToPath } from "node:url";

const outputPath = fileURLToPath(
  new URL("../.tmp-ibjjf-import.xlsx", import.meta.url)
);

const FEDERATION = "IBJJF - International Brazilian Jiu-Jitsu Federation";

const EVENTS = [
  ["2026-07-04", "Curitiba BJJ Pro IBJJF Championship 2026", "PR", "Curitiba", "Ginásio do Tarumã"],
  ["2026-07-05", "Kids International IBJJF Jiu-Jitsu Championship - Curitiba 2026", "PR", "Curitiba", "Ginásio do Tarumã"],
  ["2026-07-10", "Rio Winter International Open IBJJF Jiu-Jitsu Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-07-10", "Rio Winter International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-07-12", "Rio Winter Kids International Open IBJJF Jiu-Jitsu Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-07-12", "Rio Winter Kids International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-07-17", "São Paulo International Open IBJJF Jiu-Jitsu Championship 2026", "SP", "Barueri", "Ginásio Poliesportivo José Correa"],
  ["2026-07-17", "São Paulo International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "SP", "Barueri", "Ginásio Poliesportivo José Correa"],
  ["2026-07-19", "São Paulo Kids International Open IBJJF Jiu-Jitsu Championship 2026", "SP", "Barueri", "Ginásio Poliesportivo José Correa"],
  ["2026-07-19", "São Paulo Kids International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "SP", "Barueri", "Ginásio Poliesportivo José Correa"],
  ["2026-07-25", "Master International Jiu-Jitsu Championship - South America 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-08-01", "Vitória International Open IBJJF Jiu-Jitsu Championship 2026", "ES", "Vitória", "Ginásio Tancredão"],
  ["2026-08-01", "Vitória International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "ES", "Vitória", "Ginásio Tancredão"],
  ["2026-08-02", "Vitória Kids International Open IBJJF Jiu-Jitsu Championship 2026", "ES", "Vitória", "Ginásio Tancredão"],
  ["2026-08-08", "Floripa Winter International Open IBJJF Jiu-Jitsu Championship 2026", "SC", "São José", "Arena Centro Multiuso de São José"],
  ["2026-08-08", "Floripa Winter International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "SC", "São José", "Arena Centro Multiuso de São José"],
  ["2026-08-09", "Floripa Winter Kids International Open IBJJF Jiu-Jitsu Championship 2026", "SC", "São José", "Arena Centro Multiuso de São José"],
  ["2026-08-15", "Juiz de Fora International Open IBJJF Jiu-Jitsu Championship 2026", "MG", "Juiz de Fora", "Ginásio Municipal Jornalista Antônio Marcos"],
  ["2026-08-15", "Juiz de Fora International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "MG", "Juiz de Fora", "Ginásio Municipal Jornalista Antônio Marcos"],
  ["2026-08-16", "Juiz de Fora Kids International Open IBJJF Jiu-Jitsu Championship 2026", "MG", "Juiz de Fora", "Ginásio Municipal Jornalista Antônio Marcos"],
  ["2026-08-22", "Fortaleza Winter International Open IBJJF Jiu-Jitsu Championship 2026", "CE", "Fortaleza", "Ginásio Paulo Sarasate"],
  ["2026-08-22", "Fortaleza Winter International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "CE", "Fortaleza", "Ginásio Paulo Sarasate"],
  ["2026-08-23", "Fortaleza Winter Kids International Open IBJJF Jiu-Jitsu Championship 2026", "CE", "Fortaleza", "Ginásio Paulo Sarasate"],
  ["2026-09-11", "Campeonato Sul-Americano de Jiu-Jitsu No-Gi 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-09-12", "Campeonato Brasileiro de Jiu-Jitsu Sem Kimono (idade 04 a 15 anos) 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-09-19", "Manaus International Open IBJJF Jiu-Jitsu Championship 2026", "AM", "Manaus", "Arena Poliesportiva Amadeu Teixeira"],
  ["2026-09-19", "Manaus International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "AM", "Manaus", "Arena Poliesportiva Amadeu Teixeira"],
  ["2026-09-20", "Manaus Kids International Open IBJJF Jiu-Jitsu Championship 2026", "AM", "Manaus", "Arena Poliesportiva Amadeu Teixeira"],
  ["2026-09-25", "Campeonato Sul-Americano de Jiu-Jitsu 2026", "SP", "Barueri", "Ginásio Poliesportivo José Correa"],
  ["2026-10-10", "Curitiba Spring International Open IBJJF Jiu-Jitsu Championship 2026", "PR", "Curitiba", "Ginásio do Tarumã"],
  ["2026-10-10", "Curitiba Spring International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "PR", "Curitiba", "Ginásio do Tarumã"],
  ["2026-10-11", "Curitiba Spring Kids International Open IBJJF Jiu-Jitsu Championship 2026", "PR", "Curitiba", "Ginásio do Tarumã"],
  ["2026-10-16", "Rio Spring International Open IBJJF Jiu-Jitsu Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-10-16", "Rio Spring International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-10-18", "Rio Spring Kids International Open IBJJF Jiu-Jitsu Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
  ["2026-10-18", "Rio Spring Kids International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", "RJ", "Rio de Janeiro", "Centro Esportivo Miécimo da Silva"],
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
