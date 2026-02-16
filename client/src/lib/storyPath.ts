export interface StoryStep {
  dialogueId: string;
  npcName: string;
  room: string;
  roomLabel: string;
}

export const STORY_PATH: StoryStep[] = [
  { dialogueId: "elena", npcName: "Elena", room: "neighborhood", roomLabel: "Esperanza St." },
  { dialogueId: "carlos", npcName: "Carlos", room: "neighborhood", roomLabel: "Esperanza St." },
  { dialogueId: "mrs_chen", npcName: "Mrs. Chen", room: "neighborhood", roomLabel: "Esperanza St." },
  { dialogueId: "pastor_davis", npcName: "Pastor Davis", room: "community_center", roomLabel: "Community Center" },
  { dialogueId: "rosa", npcName: "Rosa", room: "community_center", roomLabel: "Community Center" },
  { dialogueId: "james", npcName: "James", room: "community_center", roomLabel: "Community Center" },
  { dialogueId: "lawyer_kim", npcName: "Atty. Kim", room: "courthouse", roomLabel: "Courthouse" },
  { dialogueId: "davino", npcName: "Davino", room: "courthouse", roomLabel: "Courthouse" },
  { dialogueId: "teacher_martinez", npcName: "Ms. Martinez", room: "school", roomLabel: "School" },
  { dialogueId: "sofia", npcName: "Sofia", room: "school", roomLabel: "School" },
  { dialogueId: "tommy", npcName: "Tommy", room: "school", roomLabel: "School" },
  { dialogueId: "officer_reyes", npcName: "Officer Reyes", room: "park", roomLabel: "Park" },
  { dialogueId: "lucia", npcName: "Lucia", room: "park", roomLabel: "Park" },
  { dialogueId: "mr_park", npcName: "Mr. Park", room: "main_street", roomLabel: "Main Street" },
  { dialogueId: "mama", npcName: "Mama", room: "home", roomLabel: "Home" },
  { dialogueId: "abuela", npcName: "Abuela", room: "home", roomLabel: "Home" },
];

export function getNextStoryStep(talkedTo: Set<string>): StoryStep | null {
  for (const step of STORY_PATH) {
    if (!talkedTo.has(step.dialogueId)) {
      return step;
    }
  }
  return null;
}

export function getStoryHint(talkedTo: Set<string>): string | null {
  const next = getNextStoryStep(talkedTo);
  if (!next) return null;
  const hints: Record<string, string> = {
    elena: "Talk to Elena on Esperanza St.",
    carlos: "Carlos is nearby — he has a story about checkpoints.",
    mrs_chen: "Mrs. Chen has been watching from her bench.",
    pastor_davis: "Head to the Community Center to find Pastor Davis.",
    rosa: "Rosa is organizing help at the Community Center.",
    james: "James is documenting what's happening — find him at the Center.",
    lawyer_kim: "Visit Atty. Kim at the Courthouse for legal advice.",
    davino: "Davino is at the Courthouse — hear his story.",
    teacher_martinez: "Go to the School and talk to Ms. Martinez.",
    sofia: "Sofia is at the School — she's waiting for her Papa.",
    tommy: "Tommy runs a rights club at the School.",
    officer_reyes: "Officer Reyes is at the Park. He knows the difference.",
    lucia: "Lucia is organizing supplies at the Park.",
    mr_park: "Mr. Park is on Main Street. His restaurant tells a story.",
    mama: "Go Home and talk to Mama.",
    abuela: "Abuela is Home. She has wisdom to share.",
  };
  return hints[next.dialogueId] || `Find ${next.npcName} at ${next.roomLabel}.`;
}
