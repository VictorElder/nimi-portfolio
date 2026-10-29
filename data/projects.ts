export type Project = {
  title: string;
  type: string;
  image: string;
  description: string;
};

export const projects: Project[] = [
  {
    title: "Rare Bites",
    type: "Restaurant launch campaign",
    image: "/images/nimi-job-rare-bites.jpg",
    description:
      "An opening announcement designed to make the menu the hero. Soft pink tones, oversized type, and modular food imagery create a friendly, immediate prompt to order.",
  },
  {
    title: "Bexgaming",
    type: "Esports tournament poster",
    image: "/images/nimi-job-bexgaming.jpg",
    description:
      "A tournament listing reimagined as an event identity. High-contrast typography, electric green accents, and athlete-led imagery build momentum before match day.",
  },
  {
    title: "Dpastry Paradise",
    type: "Bakery brand promotion",
    image: "/images/nimi-job-dpastry.jpg",
    description:
      "A single promotional visual that gives the full product range a delicious sense of scale. The warm palette and clear hierarchy make every offer easy to discover.",
  },
  {
    title: "The Fragrance House",
    type: "Luxury retail campaign",
    image: "/images/nimi-job-fragrance-house.jpg",
    description:
      "A luxury retail visual that positions fragrance as an experience, not just a product. Editorial typography and a cinematic Paris setting create a premium, aspirational mood.",
  },
];

