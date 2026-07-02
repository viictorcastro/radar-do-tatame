import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FEDERATIONS = [
  { name: "CBJJ - Confederação Brasileira de Jiu-Jitsu", website: "https://cbjj.com.br" },
  {
    name: "IBJJF - International Brazilian Jiu-Jitsu Federation",
    website: "https://ibjjf.com",
  },
  { name: "AJP Tour", website: "https://ajptour.com" },
  { name: "Federação Paulista de Jiu-Jitsu", website: "https://fpjj.com.br" },
  {
    name: "CBJJO - Confederação Brasileira de Jiu-Jitsu Olímpico",
    website: "https://www.cbjjo.com.br",
  },
  { name: "CBJJE", website: "https://www.cbjje.com.br" },
  { name: "CBJJD", website: "https://cbjjd.com.br" },
  { name: "FJJ RIO", website: "https://www.fjjrio.app.br" },
  { name: "FMJJ", website: "https://fmjj.com.br" },
  {
    name: "FJJEMG - Federação de Jiu Jitsu do Estado de Minas Gerais",
    website: "https://fjjemg.com.br",
  },
];

// Extraído dos calendários oficiais de cada federação em 2026-07-02:
// IBJJF (https://cbjj.com.br/events/calendar), CBJJO
// (https://www.cbjjo.com.br/site/eventos/calendario), CBJJE
// (https://www.cbjje.com.br/?p=campeonatos), CBJJD
// (https://cbjjd.com.br/eventos/), FJJ RIO (https://www.fjjrio.app.br/),
// FMJJ (https://fmjj.com.br/) e FJJEMG (https://fjjemg.com.br/).
// Eventos com mais de um dia usam a data de início. Coordenadas geocodificadas
// automaticamente a partir de Cidade/Estado (ver lib/geocode.ts). Nomes de
// eventos genéricos (ex: "Mundial", "Campeonato Mineiro de Jiu-Jitsu") ganham
// o sufixo da federação para não serem confundidos com eventos homônimos de
// outras federações — FMJJ e FJJEMG usam o mesmo nome "Campeonato Mineiro de
// Jiu-Jitsu" para competições diferentes. Cidade do CEFAN (CBJJD) e do Ginásio
// Pedro Jahara/Pedrão (FJJ RIO) confirmadas com o usuário, pois não vinham
// explícitas na fonte original. Etapas da FMJJ com data anterior a 2026-07-02
// (1ª e 2ª) já haviam ocorrido e foram omitidas.
const IBJJF = "IBJJF - International Brazilian Jiu-Jitsu Federation";
const CBJJO = "CBJJO - Confederação Brasileira de Jiu-Jitsu Olímpico";
const CBJJE = "CBJJE";
const CBJJD = "CBJJD";
const FJJ_RIO = "FJJ RIO";
const FMJJ = "FMJJ";
const FJJEMG = "FJJEMG - Federação de Jiu Jitsu do Estado de Minas Gerais";

const CHAMPIONSHIPS: Array<{
  name: string;
  federation: string;
  date: string;
  state: string;
  city: string;
  venue: string | null;
  latitude: number;
  longitude: number;
}> = [
  { name: "Curitiba BJJ Pro IBJJF Championship 2026", federation: IBJJF, date: "2026-07-04", state: "PR", city: "Curitiba", venue: "Ginásio do Tarumã", latitude: -25.4295963, longitude: -49.2712724 },
  { name: "Kids International IBJJF Jiu-Jitsu Championship - Curitiba 2026", federation: IBJJF, date: "2026-07-05", state: "PR", city: "Curitiba", venue: "Ginásio do Tarumã", latitude: -25.4295963, longitude: -49.2712724 },
  { name: "Rio Winter International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-07-10", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rio Winter International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-07-10", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rio Winter Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-07-12", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rio Winter Kids International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-07-12", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "São Paulo International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-07-17", state: "SP", city: "Barueri", venue: "Ginásio Poliesportivo José Correa", latitude: -23.5112184, longitude: -46.8764612 },
  { name: "São Paulo International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-07-17", state: "SP", city: "Barueri", venue: "Ginásio Poliesportivo José Correa", latitude: -23.5112184, longitude: -46.8764612 },
  { name: "São Paulo Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-07-19", state: "SP", city: "Barueri", venue: "Ginásio Poliesportivo José Correa", latitude: -23.5112184, longitude: -46.8764612 },
  { name: "São Paulo Kids International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-07-19", state: "SP", city: "Barueri", venue: "Ginásio Poliesportivo José Correa", latitude: -23.5112184, longitude: -46.8764612 },
  { name: "Master International Jiu-Jitsu Championship - South America 2026", federation: IBJJF, date: "2026-07-25", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Vitória International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-01", state: "ES", city: "Vitória", venue: "Ginásio Tancredão", latitude: -20.3200917, longitude: -40.3376682 },
  { name: "Vitória International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-08-01", state: "ES", city: "Vitória", venue: "Ginásio Tancredão", latitude: -20.3200917, longitude: -40.3376682 },
  { name: "Vitória Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-02", state: "ES", city: "Vitória", venue: "Ginásio Tancredão", latitude: -20.3200917, longitude: -40.3376682 },
  { name: "Floripa Winter International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-08", state: "SC", city: "São José", venue: "Arena Centro Multiuso de São José", latitude: -27.6157733, longitude: -48.6276491 },
  { name: "Floripa Winter International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-08-08", state: "SC", city: "São José", venue: "Arena Centro Multiuso de São José", latitude: -27.6157733, longitude: -48.6276491 },
  { name: "Floripa Winter Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-09", state: "SC", city: "São José", venue: "Arena Centro Multiuso de São José", latitude: -27.6157733, longitude: -48.6276491 },
  { name: "Juiz de Fora International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-15", state: "MG", city: "Juiz de Fora", venue: "Ginásio Municipal Jornalista Antônio Marcos", latitude: -21.7609533, longitude: -43.3501129 },
  { name: "Juiz de Fora International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-08-15", state: "MG", city: "Juiz de Fora", venue: "Ginásio Municipal Jornalista Antônio Marcos", latitude: -21.7609533, longitude: -43.3501129 },
  { name: "Juiz de Fora Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-16", state: "MG", city: "Juiz de Fora", venue: "Ginásio Municipal Jornalista Antônio Marcos", latitude: -21.7609533, longitude: -43.3501129 },
  { name: "Fortaleza Winter International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-22", state: "CE", city: "Fortaleza", venue: "Ginásio Paulo Sarasate", latitude: -3.7932167, longitude: -38.5280359 },
  { name: "Fortaleza Winter International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-08-22", state: "CE", city: "Fortaleza", venue: "Ginásio Paulo Sarasate", latitude: -3.7932167, longitude: -38.5280359 },
  { name: "Fortaleza Winter Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-08-23", state: "CE", city: "Fortaleza", venue: "Ginásio Paulo Sarasate", latitude: -3.7932167, longitude: -38.5280359 },
  { name: "Campeonato Sul-Americano de Jiu-Jitsu No-Gi 2026", federation: IBJJF, date: "2026-09-11", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Campeonato Brasileiro de Jiu-Jitsu Sem Kimono (idade 04 a 15 anos) 2026", federation: IBJJF, date: "2026-09-12", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Manaus International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-09-19", state: "AM", city: "Manaus", venue: "Arena Poliesportiva Amadeu Teixeira", latitude: -3.1316333, longitude: -59.9825041 },
  { name: "Manaus International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-09-19", state: "AM", city: "Manaus", venue: "Arena Poliesportiva Amadeu Teixeira", latitude: -3.1316333, longitude: -59.9825041 },
  { name: "Manaus Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-09-20", state: "AM", city: "Manaus", venue: "Arena Poliesportiva Amadeu Teixeira", latitude: -3.1316333, longitude: -59.9825041 },
  { name: "Campeonato Sul-Americano de Jiu-Jitsu 2026", federation: IBJJF, date: "2026-09-25", state: "SP", city: "Barueri", venue: "Ginásio Poliesportivo José Correa", latitude: -23.5112184, longitude: -46.8764612 },
  { name: "Curitiba Spring International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-10-10", state: "PR", city: "Curitiba", venue: "Ginásio do Tarumã", latitude: -25.4295963, longitude: -49.2712724 },
  { name: "Curitiba Spring International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-10-10", state: "PR", city: "Curitiba", venue: "Ginásio do Tarumã", latitude: -25.4295963, longitude: -49.2712724 },
  { name: "Curitiba Spring Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-10-11", state: "PR", city: "Curitiba", venue: "Ginásio do Tarumã", latitude: -25.4295963, longitude: -49.2712724 },
  { name: "Rio Spring International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-10-16", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rio Spring International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-10-16", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rio Spring Kids International Open IBJJF Jiu-Jitsu Championship 2026", federation: IBJJF, date: "2026-10-18", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rio Spring Kids International Open IBJJF Jiu-Jitsu No-Gi Championship 2026", federation: IBJJF, date: "2026-10-18", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Mundial CBJJO 2026", federation: CBJJO, date: "2026-07-04", state: "RJ", city: "Rio de Janeiro", venue: "Arena da Barra", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Mundial Feminino CBJJO 2026", federation: CBJJO, date: "2026-08-08", state: "RJ", city: "Rio de Janeiro", venue: "Urca", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Panamericano CBJJO 2026", federation: CBJJO, date: "2026-09-12", state: "RJ", city: "Rio de Janeiro", venue: "Centro Esportivo Miécimo da Silva", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Maricá Golden Cup CBJJO 2026", federation: CBJJO, date: "2026-10-03", state: "RJ", city: "Maricá", venue: null, latitude: -22.9088758, longitude: -42.8171914 },
  { name: "World Cup CBJJO 2026", federation: CBJJO, date: "2026-11-07", state: "RJ", city: "Rio de Janeiro", venue: "Arena da Barra", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "BJJ Nacional CBJJE 2026", federation: CBJJE, date: "2026-08-01", state: "SP", city: "São Paulo", venue: null, latitude: -23.5506507, longitude: -46.6333824 },
  { name: "BJJ Internacional CBJJE 2026", federation: CBJJE, date: "2026-09-19", state: "SP", city: "São Bernardo do Campo", venue: null, latitude: -23.7080345, longitude: -46.5506747 },
  { name: "Pan-Americano CBJJE 2026", federation: CBJJE, date: "2026-10-23", state: "SP", city: "São Paulo", venue: null, latitude: -23.5506507, longitude: -46.6333824 },
  { name: "Mundial CBJJE 2026 - Juvenil / Adulto / Master", federation: CBJJE, date: "2026-11-26", state: "SP", city: "São Paulo", venue: null, latitude: -23.5506507, longitude: -46.6333824 },
  { name: "Mundial CBJJE 2026 - Kids", federation: CBJJE, date: "2026-12-04", state: "SP", city: "São Paulo", venue: null, latitude: -23.5506507, longitude: -46.6333824 },
  { name: "Vitória International Cup", federation: CBJJD, date: "2026-07-05", state: "ES", city: "Vitória", venue: "Ginásio Tancredão", latitude: -20.3200917, longitude: -40.3376682 },
  { name: "Cabo Frio National Open", federation: CBJJD, date: "2026-07-18", state: "RJ", city: "Cabo Frio", venue: "Ginásio Municipal", latitude: -22.7378309, longitude: -42.0240869 },
  { name: "5ª Etapa Brasileiro", federation: CBJJD, date: "2026-07-25", state: "RJ", city: "Rio de Janeiro", venue: "CEFAN - Centro de Educação Física Almirante Nunes", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Saquarema International Cup", federation: CBJJD, date: "2026-08-22", state: "RJ", city: "Saquarema", venue: "FAETEC", latitude: -22.9257974, longitude: -42.507633 },
  { name: "6ª Etapa Rio Winter National Open", federation: CBJJD, date: "2026-08-29", state: "RJ", city: "Rio de Janeiro", venue: "CEFAN - Centro de Educação Física Almirante Nunes", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "7ª Etapa Mundial e Mundial Novatos", federation: CBJJD, date: "2026-09-25", state: "RJ", city: "Cabo Frio", venue: null, latitude: -22.7378309, longitude: -42.0240869 },
  { name: "Saquarema Spring National Open", federation: CBJJD, date: "2026-10-17", state: "RJ", city: "Saquarema", venue: "FAETEC", latitude: -22.9257974, longitude: -42.507633 },
  { name: "8ª Etapa Rio International Cup", federation: CBJJD, date: "2026-11-14", state: "RJ", city: "Rio de Janeiro", venue: "Velódromo", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Serrano 2026", federation: FJJ_RIO, date: "2026-07-18", state: "RJ", city: "Teresópolis", venue: "Ginásio Poliesportivo Pedro Jahara (Pedrão)", latitude: -22.2978038, longitude: -42.8646411 },
  { name: "Carlson Gracie 2026", federation: FJJ_RIO, date: "2026-08-15", state: "RJ", city: "Rio de Janeiro", venue: "Velódromo Olímpico do Rio de Janeiro", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Carioca 2026", federation: FJJ_RIO, date: "2026-09-19", state: "RJ", city: "Rio de Janeiro", venue: "Clube Municipal", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rei do Rio 2026", federation: FJJ_RIO, date: "2026-10-24", state: "RJ", city: "Rio de Janeiro", venue: "Arena Carioca 1", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "Rolls Gracie 2026", federation: FJJ_RIO, date: "2026-12-05", state: "RJ", city: "Rio de Janeiro", venue: "Arena Carioca 1", latitude: -22.9110137, longitude: -43.2093727 },
  { name: "52º Campeonato Mineiro de Jiu-Jitsu (FMJJ) - 3ª Etapa: Lutadores", federation: FMJJ, date: "2026-07-12", state: "MG", city: "Belo Horizonte", venue: null, latitude: -19.9227318, longitude: -43.9450948 },
  { name: "52º Campeonato Mineiro de Jiu-Jitsu (FMJJ) - 4ª Etapa: Campeões", federation: FMJJ, date: "2026-09-20", state: "MG", city: "Belo Horizonte", venue: null, latitude: -19.9227318, longitude: -43.9450948 },
  { name: "52º Campeonato Mineiro de Jiu-Jitsu (FMJJ) - 5ª Etapa: Invictos", federation: FMJJ, date: "2026-11-22", state: "MG", city: "Belo Horizonte", venue: null, latitude: -19.9227318, longitude: -43.9450948 },
  { name: "Belo Horizonte Minas Open FJJEMG 2026", federation: FJJEMG, date: "2026-07-05", state: "MG", city: "Belo Horizonte", venue: null, latitude: -19.9227318, longitude: -43.9450948 },
  { name: "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 4ª Etapa", federation: FJJEMG, date: "2026-07-18", state: "MG", city: "Juiz de Fora", venue: null, latitude: -21.7609533, longitude: -43.3501129 },
  { name: "Lavras Minas Open FJJEMG 2026", federation: FJJEMG, date: "2026-08-02", state: "MG", city: "Lavras", venue: null, latitude: -21.2425512, longitude: -44.9991978 },
  { name: "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 5ª Etapa", federation: FJJEMG, date: "2026-08-16", state: "MG", city: "Belo Horizonte", venue: "Mineirinho", latitude: -19.9227318, longitude: -43.9450948 },
  { name: "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 6ª Etapa", federation: FJJEMG, date: "2026-09-26", state: "MG", city: "Juiz de Fora", venue: null, latitude: -21.7609533, longitude: -43.3501129 },
  { name: "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 7ª Etapa", federation: FJJEMG, date: "2026-10-17", state: "MG", city: "Belo Horizonte", venue: null, latitude: -19.9227318, longitude: -43.9450948 },
  { name: "Muriaé Minas Open FJJEMG 2026", federation: FJJEMG, date: "2026-10-25", state: "MG", city: "Muriaé", venue: null, latitude: -21.1313485, longitude: -42.3628918 },
  { name: "Campeonato Mineiro de Jiu-Jitsu FJJEMG 2026 - 8ª Etapa", federation: FJJEMG, date: "2026-11-21", state: "MG", city: "Juiz de Fora", venue: null, latitude: -21.7609533, longitude: -43.3501129 },
];

async function main() {
  console.log("Seeding database...");

  for (const f of FEDERATIONS) {
    await prisma.federation.upsert({
      where: { name: f.name },
      update: { website: f.website },
      create: { name: f.name, website: f.website },
    });
  }

  await prisma.championship.deleteMany();

  for (const c of CHAMPIONSHIPS) {
    const federation = await prisma.federation.findUniqueOrThrow({
      where: { name: c.federation },
    });

    await prisma.championship.create({
      data: {
        name: c.name,
        federationId: federation.id,
        date: new Date(c.date),
        state: c.state,
        city: c.city,
        venue: c.venue,
        latitude: c.latitude,
        longitude: c.longitude,
      },
    });
  }

  console.log(`Seed concluído: ${FEDERATIONS.length} federações, ${CHAMPIONSHIPS.length} campeonatos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
