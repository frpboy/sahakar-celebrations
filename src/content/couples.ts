export interface CoupleMember {
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface Couple {
  id: string;
  groom: CoupleMember;
  bride: CoupleMember;
  coupleName: string;
  invitationUrl: string;
  theme: string;
  imageSrc?: string;
  images?: string[];
  desc?: string;
}

export const couples: Couple[] = [
  {
    id: "shabin-sana",
    groom: {
      firstName: "Muhammed",
      lastName: "Shabin",
      fullName: "Muhammed Shabin",
    },
    bride: {
      firstName: "",
      lastName: "Sana",
      fullName: "Sana",
    },
    coupleName: "Shabin & Sana",
    invitationUrl: "https://shabin-weds-sana.vercel.app",
    theme: "emerald-gold",
    imageSrc: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"],
    desc: "The union of Muhammed Shabin and Sana. Celebrating lifetime bonds and eternal companionship.",
  },
  {
    id: "sameer-nihala",
    groom: {
      firstName: "Mohammed Sameer",
      lastName: "Kallangadan",
      fullName: "Mohammed Sameer Kallangadan",
    },
    bride: {
      firstName: "Nihala Jasmin",
      lastName: "KK",
      fullName: "Nihala Jasmin KK",
    },
    coupleName: "Sameer & Nihala",
    invitationUrl: "https://sameer-weds-nihala.vercel.app",
    theme: "ivory-bronze",
    imageSrc: "/sameer-nihala-1.jpeg",
    images: ["/sameer-nihala-1.jpeg", "/sameer-nihala-2.jpeg"],
    desc: "The union of Mohammed Sameer Kallangadan and Nihala Jasmin KK. Celebrating new horizons and relational commitments.",
  },
];
