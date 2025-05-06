
interface Program {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  programs: Program[];
}

export const departments: Department[] = [
  {
    id: "info",
    name: "Informatique",
    programs: [
      { id: "gl", name: "Génie Logiciel" },
      { id: "ia", name: "Intelligence Artificielle" },
      { id: "rs", name: "Réseaux et Systèmes" },
      { id: "bd", name: "Big Data et Analytics" }
    ]
  },
  {
    id: "elec",
    name: "Électronique",
    programs: [
      { id: "auto", name: "Automatique" },
      { id: "emb", name: "Systèmes Embarqués" },
      { id: "rob", name: "Robotique" }
    ]
  },
  {
    id: "meca",
    name: "Mécanique",
    programs: [
      { id: "ind", name: "Ingénierie Industrielle" },
      { id: "ener", name: "Énergétique" },
      { id: "mat", name: "Matériaux" }
    ]
  },
  {
    id: "chem",
    name: "Chimie",
    programs: [
      { id: "organique", name: "Chimie Organique" },
      { id: "phys", name: "Physico-chimie" },
      { id: "anal", name: "Chimie Analytique" }
    ]
  },
  {
    id: "bio",
    name: "Biologie",
    programs: [
      { id: "biotech", name: "Biotechnologies" },
      { id: "micro", name: "Microbiologie" },
      { id: "gen", name: "Génétique" }
    ]
  }
];
