export type AwardCategory = {
  id: string;
  number: number;
  stage: 1 | 2;
  area: string;
  title: string;
  nominees: string[];
};

export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    id: "cat-1",
    number: 1,
    stage: 1,
    area: "Planejamento & Mídia",
    title: "PLAYMAKER",
    nominees: [
      "Camila Silva",
      "Maria Luiza Nazario",
      "Renan Yasuoka"
    ]
  },
  {
    id: "cat-2",
    number: 2,
    stage: 1,
    area: "Atendimento Client Solutions",
    title: "DESTAQUES GAME CONTROL",
    nominees: [
      "Jason Dair & Giovana Borghi",
      "Erick Ferioli & Rayane Quinteiro",
      "Fabiana Cabral & Emerson Gabriel"
    ]
  },
  {
    id: "cat-3",
    number: 3,
    stage: 1,
    area: "Assistente Comercial",
    title: "DESTAQUE GAME PACE",
    nominees: [
      "Juliana Smach",
      "Tamires Leite",
      "Isabela Mota",
      "Beatriz Rodrigues"
    ]
  },
  {
    id: "cat-4",
    number: 4,
    stage: 2,
    area: "Executivo Comercial Regional",
    title: "CRAQUE DA TEMPORADA 2025 | REGIONAIS",
    nominees: [
      "Izabella de Luna - Recife",
      "Fernanda Contador - Curitiba",
      "Bruna Dalbem - POA"
    ]
  },
  {
    id: "cat-5",
    number: 5,
    stage: 2,
    area: "Executivo Comercial RJ",
    title: "CRAQUE DA TEMPORADA 2025 | RJ",
    nominees: [
      "Katia Correia",
      "Patricia Bahia",
      "Danielle Correa"
    ]
  },
  {
    id: "cat-6",
    number: 6,
    stage: 2,
    area: "Executivo Comercial SP",
    title: "CRAQUE DA TEMPORADA 2025 | SP",
    nominees: [
      "Vinicius Patriota - Time Danilo Turlão",
      "Maria Helena Rocha - Time Luciana Finatti",
      "Carlos Marques - Pedro Barros",
      "Gustavo Pinto - Sergio Fridman"
    ]
  }
];

export const ASSETS = [
  "1-Eletro-Conveno-LOGO-1.png",
  "1-Eletro-Conveno-LOGO-2.png",
  "1-Eletro-Conveno-LOGO-3.png",
  "2-Eletro-Conveno-Tema-1.png",
  "2-Eletro-Conveno-Tema-2.png",
  "2-Eletro-Conveno-Tema-3.png",
  "3-Eletro-Conveno-Mote-1.png",
  "3-Eletro-Conveno-Mote-2.png",
  "3-Eletro-Conveno-Mote-3.png",
  "4-Eletro-Conveno-Grafismos-1.png",
  "4-Eletro-Conveno-Grafismos-10.png",
  "4-Eletro-Conveno-Grafismos-11.png",
  "4-Eletro-Conveno-Grafismos-12.png",
  "4-Eletro-Conveno-Grafismos-13.png",
  "4-Eletro-Conveno-Grafismos-14.png",
  "4-Eletro-Conveno-Grafismos-15.png",
  "4-Eletro-Conveno-Grafismos-16.png",
  "4-Eletro-Conveno-Grafismos-2.png",
  "4-Eletro-Conveno-Grafismos-3.png",
  "4-Eletro-Conveno-Grafismos-4.png",
  "4-Eletro-Conveno-Grafismos-5.png",
  "4-Eletro-Conveno-Grafismos-6.png",
  "4-Eletro-Conveno-Grafismos-7.png",
  "4-Eletro-Conveno-Grafismos-8.png",
  "4-Eletro-Conveno-Grafismos-9.png"
];

export const LOGIN_LOGO = "1-Eletro-Conveno-LOGO-2.png";
export const LEAGUE_LOGO = "2-Eletro-Conveno-Tema-1.png";
export const SUCCESS_MOTE = "3-Eletro-Conveno-Mote-2.png";
