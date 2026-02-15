export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
  contentId?: number;
  isEnd?: boolean;
}

export interface DialogueChoice {
  text: string;
  nextNodeId: string;
}

export interface DialogueTree {
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export const npcDialogues: Record<string, DialogueTree> = {
  elena: {
    startNodeId: "elena_start",
    nodes: {
      elena_start: {
        id: "elena_start",
        speaker: "Elena",
        text: "Hey... you live around here too, right? Things have been really scary lately. Did you hear what happened to the Ramirez family?",
        choices: [
          { text: "What happened to them?", nextNodeId: "elena_raid" },
          { text: "Yeah, everyone seems on edge. Why?", nextNodeId: "elena_fear" },
          { text: "Are you doing okay?", nextNodeId: "elena_personal" },
        ],
      },
      elena_raid: {
        id: "elena_raid",
        speaker: "Elena",
        text: "ICE showed up at their workplace last Tuesday. No warning. They just stormed in and grabbed people. Mr. Ramirez was taken right off the factory floor in front of everyone. His kids were waiting at school for a pickup that never came.",
        contentId: 9,
        choices: [
          { text: "That's terrible. Is that even legal?", nextNodeId: "elena_legal" },
          { text: "What happened to the kids?", nextNodeId: "elena_kids" },
        ],
      },
      elena_fear: {
        id: "elena_fear",
        speaker: "Elena",
        text: "ICE has been doing workplace raids around here. They don't care if you have a family, if your kids are at school waiting. They just grab people. The whole neighborhood is afraid to go to work now.",
        contentId: 9,
        choices: [
          { text: "Have the raids affected other families too?", nextNodeId: "elena_others" },
          { text: "Is there anything people can do?", nextNodeId: "elena_help" },
        ],
      },
      elena_personal: {
        id: "elena_personal",
        speaker: "Elena",
        text: "Honestly? I'm scared. My cousin works at the same factory they raided. Every morning I wonder if today is the day they come for someone else I know. Nobody feels safe anymore.",
        choices: [
          { text: "Tell me about the raids.", nextNodeId: "elena_raid" },
          { text: "Is there a way to stay safe?", nextNodeId: "elena_help" },
        ],
      },
      elena_legal: {
        id: "elena_legal",
        speaker: "Elena",
        text: "That's what everyone asks. Apparently they're supposed to have warrants, but people are too scared to question it when armed agents show up. Attorney Kim at the courthouse might know more about the legal side.",
        choices: [
          { text: "I'll go talk to Attorney Kim.", nextNodeId: "elena_end" },
          { text: "What else can people do?", nextNodeId: "elena_help" },
        ],
      },
      elena_kids: {
        id: "elena_kids",
        speaker: "Elena",
        text: "The neighbors took them in for now. But can you imagine? Those kids went from a normal Tuesday to wondering if they'll ever see their dad again. Ms. Martinez at the school has been trying to help the kids cope.",
        choices: [
          { text: "I should talk to Ms. Martinez.", nextNodeId: "elena_end" },
          { text: "Is there anything else going on?", nextNodeId: "elena_others" },
        ],
      },
      elena_others: {
        id: "elena_others",
        speaker: "Elena",
        text: "The whole community is living in fear. People are afraid to go to the grocery store, to church, to pick their kids up from school. Rosa at the community center says attendance has dropped because families are hiding at home.",
        contentId: 12,
        choices: [
          { text: "I'll check on the community center.", nextNodeId: "elena_end" },
        ],
      },
      elena_help: {
        id: "elena_help",
        speaker: "Elena",
        text: "Pastor Davis at the community center is organizing know-your-rights workshops. And Tommy at the school has been telling kids about checkpoint rights. It's not much, but knowledge is power, right?",
        choices: [
          { text: "Thanks, Elena. I'll look into that.", nextNodeId: "elena_end" },
        ],
      },
      elena_end: {
        id: "elena_end",
        speaker: "Elena",
        text: "Be careful out there. And if you learn anything that could help us, please come back and tell me. We have to look out for each other.",
        isEnd: true,
      },
    },
  },

  carlos: {
    startNodeId: "carlos_start",
    nodes: {
      carlos_start: {
        id: "carlos_start",
        speaker: "Carlos",
        text: "Yo, you heard about what's going on? My uncle got stopped at that checkpoint on Route 9 last week. He's a citizen. Born right here. They still held him for three hours.",
        choices: [
          { text: "They held a citizen? How?", nextNodeId: "carlos_citizen" },
          { text: "Is your uncle okay?", nextNodeId: "carlos_uncle" },
          { text: "What checkpoint?", nextNodeId: "carlos_checkpoint" },
        ],
      },
      carlos_citizen: {
        id: "carlos_citizen",
        speaker: "Carlos",
        text: "Happens more than you'd think. ICE has wrongfully detained and even deported U.S. citizens. There was a man named Davino Watson — he's American, born here — and they deported him anyway. It took years to sort out. Years of his life, gone.",
        contentId: 5,
        choices: [
          { text: "That's unbelievable. How does that happen?", nextNodeId: "carlos_system" },
          { text: "Is Davino okay now?", nextNodeId: "carlos_davino" },
        ],
      },
      carlos_uncle: {
        id: "carlos_uncle",
        speaker: "Carlos",
        text: "He's shaken up. They kept asking him questions, going through his car. He had his license, everything. But they said he 'matched a description.' He's lived here his whole life. This is America, man.",
        choices: [
          { text: "Has this happened to other citizens?", nextNodeId: "carlos_citizen" },
          { text: "What rights do people have at checkpoints?", nextNodeId: "carlos_rights" },
        ],
      },
      carlos_checkpoint: {
        id: "carlos_checkpoint",
        speaker: "Carlos",
        text: "They set them up on the roads leading in and out of town. Stopping everybody, asking for papers. It feels like we're living in a different country. Tommy at the school knows a lot about what your rights are at those stops.",
        contentId: 12,
        choices: [
          { text: "What rights do people have?", nextNodeId: "carlos_rights" },
          { text: "Has anyone been wrongfully detained?", nextNodeId: "carlos_citizen" },
        ],
      },
      carlos_system: {
        id: "carlos_system",
        speaker: "Carlos",
        text: "The system is broken. They make mistakes and real people pay for it. Davino got deported even though he kept telling them he was American. Nobody listened. Attorney Kim at the courthouse is trying to help people who've been wrongfully targeted.",
        choices: [
          { text: "I'll go talk to Attorney Kim.", nextNodeId: "carlos_end" },
          { text: "What can regular people do?", nextNodeId: "carlos_rights" },
        ],
      },
      carlos_davino: {
        id: "carlos_davino",
        speaker: "Carlos",
        text: "You can actually find him at the courthouse. He's been speaking out about what happened to him so it doesn't happen to other people. Takes real courage after what he went through.",
        choices: [
          { text: "I'll go find him.", nextNodeId: "carlos_end" },
        ],
      },
      carlos_rights: {
        id: "carlos_rights",
        speaker: "Carlos",
        text: "You have the right to remain silent. You don't have to answer questions about where you were born or your immigration status. You have the right to say 'I don't consent to a search.' Know your rights — it could save you or someone you love.",
        contentId: 10,
        choices: [
          { text: "Thanks for telling me, Carlos.", nextNodeId: "carlos_end" },
        ],
      },
      carlos_end: {
        id: "carlos_end",
        speaker: "Carlos",
        text: "Stay aware out there. And spread the word. The more people who know their rights, the harder it is for anyone to take them away.",
        isEnd: true,
      },
    },
  },

  mrs_chen: {
    startNodeId: "chen_start",
    nodes: {
      chen_start: {
        id: "chen_start",
        speaker: "Mrs. Chen",
        text: "Oh, hello dear. I've been sitting here watching the street all morning. Hardly anyone is out anymore. It didn't use to be like this.",
        choices: [
          { text: "Why is it so quiet?", nextNodeId: "chen_quiet" },
          { text: "How are you holding up?", nextNodeId: "chen_personal" },
          { text: "Have you seen anything happen?", nextNodeId: "chen_witness" },
        ],
      },
      chen_quiet: {
        id: "chen_quiet",
        speaker: "Mrs. Chen",
        text: "People are hiding. After the raids started, families stopped coming to the park, stopped going to the store unless they absolutely had to. My neighbor Maria won't even let her children play outside anymore.",
        contentId: 12,
        choices: [
          { text: "That's so sad. What about the businesses?", nextNodeId: "chen_business" },
          { text: "Have you seen agents around here?", nextNodeId: "chen_witness" },
        ],
      },
      chen_personal: {
        id: "chen_personal",
        speaker: "Mrs. Chen",
        text: "I've lived on this street for thirty years. Watched kids grow up, watched families build lives. Now I watch the same families torn apart. It breaks my heart.",
        choices: [
          { text: "What's been happening exactly?", nextNodeId: "chen_witness" },
          { text: "Is there anything you can do to help?", nextNodeId: "chen_help" },
        ],
      },
      chen_witness: {
        id: "chen_witness",
        speaker: "Mrs. Chen",
        text: "Last week I saw them take the Garcia boy. He was just walking home from the bus stop. They were rough with him too — pushed him against their vehicle even though he wasn't resisting at all. He's just a college kid.",
        contentId: 7,
        choices: [
          { text: "They used force even though he wasn't resisting?", nextNodeId: "chen_force" },
          { text: "Is there anyone helping these families?", nextNodeId: "chen_help" },
        ],
      },
      chen_force: {
        id: "chen_force",
        speaker: "Mrs. Chen",
        text: "Reports show ICE has used excessive force against people who posed no threat at all. Nonviolent people being thrown to the ground, handcuffed roughly. It's documented. This isn't how you treat human beings.",
        contentId: 7,
        choices: [
          { text: "Someone needs to do something about this.", nextNodeId: "chen_help" },
          { text: "Thank you for telling me, Mrs. Chen.", nextNodeId: "chen_end" },
        ],
      },
      chen_business: {
        id: "chen_business",
        speaker: "Mrs. Chen",
        text: "Mr. Park closed his restaurant. Said he couldn't keep staff — everyone is too afraid to come to work. The laundromat shut down too. This neighborhood is dying, not because people want to leave, but because they're being forced to hide.",
        choices: [
          { text: "Is anyone trying to help?", nextNodeId: "chen_help" },
          { text: "Thank you for talking to me.", nextNodeId: "chen_end" },
        ],
      },
      chen_help: {
        id: "chen_help",
        speaker: "Mrs. Chen",
        text: "Rosa and Pastor Davis are doing what they can at the community center. And Abuela — you know her, right? She's been quietly helping families at her home. Cooking for people, watching kids. Go see her if you want to help.",
        choices: [
          { text: "I will. Thanks, Mrs. Chen.", nextNodeId: "chen_end" },
        ],
      },
      chen_end: {
        id: "chen_end",
        speaker: "Mrs. Chen",
        text: "Thank you for stopping to listen to an old woman. Most people are too busy or too scared these days. Don't let fear win, okay?",
        isEnd: true,
      },
    },
  },

  rosa: {
    startNodeId: "rosa_start",
    nodes: {
      rosa_start: {
        id: "rosa_start",
        speaker: "Rosa",
        text: "Welcome to the community center. We're trying to keep this place going, but it's been hard. Fewer people show up every week. Are you here to help, or do you need information?",
        choices: [
          { text: "I want to help. What can I do?", nextNodeId: "rosa_help" },
          { text: "I'm trying to understand what's going on.", nextNodeId: "rosa_explain" },
          { text: "Who else is here?", nextNodeId: "rosa_people" },
        ],
      },
      rosa_explain: {
        id: "rosa_explain",
        speaker: "Rosa",
        text: "What's going on is that Davino Watson, an American citizen, was wrongfully deported. He told them over and over he was born here. They didn't listen. It took him years to get back. Years. And he's not the only one.",
        contentId: 8,
        choices: [
          { text: "How does someone get wrongfully deported?", nextNodeId: "rosa_wrongful" },
          { text: "What can regular people do about it?", nextNodeId: "rosa_help" },
        ],
      },
      rosa_wrongful: {
        id: "rosa_wrongful",
        speaker: "Rosa",
        text: "Mistakes in the system. Racial profiling. People who look a certain way or have certain last names get targeted. They don't always check properly before they act. Real lives are destroyed by paperwork errors and prejudice.",
        contentId: 5,
        choices: [
          { text: "That needs to change.", nextNodeId: "rosa_help" },
          { text: "Is Davino here? Can I talk to him?", nextNodeId: "rosa_davino" },
        ],
      },
      rosa_davino: {
        id: "rosa_davino",
        speaker: "Rosa",
        text: "He spends a lot of time at the courthouse now, talking to Attorney Kim and sharing his story. You should go find him there. Hearing it from him directly... it's powerful.",
        choices: [
          { text: "I'll go to the courthouse.", nextNodeId: "rosa_end" },
        ],
      },
      rosa_help: {
        id: "rosa_help",
        speaker: "Rosa",
        text: "Start by knowing your rights and spreading that knowledge. Come to the workshops we're holding. Talk to your neighbors. Show up. Call your representatives. Document what you see. Every voice matters.",
        contentId: 14,
        choices: [
          { text: "What workshops are you holding?", nextNodeId: "rosa_workshop" },
          { text: "Thanks, Rosa. I want to help.", nextNodeId: "rosa_end" },
        ],
      },
      rosa_workshop: {
        id: "rosa_workshop",
        speaker: "Rosa",
        text: "Pastor Davis runs know-your-rights sessions every week. We teach people what to do if ICE comes to their door, what to say at checkpoints, how to prepare an emergency plan for your family. Knowledge is the best defense.",
        choices: [
          { text: "I'll talk to Pastor Davis.", nextNodeId: "rosa_end" },
        ],
      },
      rosa_people: {
        id: "rosa_people",
        speaker: "Rosa",
        text: "James is here — he's been documenting cases of excessive force. And Pastor Davis runs our workshops. They're both good people to talk to if you want to understand what's happening.",
        choices: [
          { text: "I'll talk to them. Thanks.", nextNodeId: "rosa_end" },
        ],
      },
      rosa_end: {
        id: "rosa_end",
        speaker: "Rosa",
        text: "Thank you for coming. It means a lot that someone cares enough to show up. Come back anytime.",
        isEnd: true,
      },
    },
  },

  james: {
    startNodeId: "james_start",
    nodes: {
      james_start: {
        id: "james_start",
        speaker: "James",
        text: "I've been collecting testimonies from people who've had encounters with ICE. What I've found is... disturbing. Do you want to hear about it?",
        choices: [
          { text: "Yes, tell me what you've found.", nextNodeId: "james_findings" },
          { text: "Why are you doing this?", nextNodeId: "james_why" },
        ],
      },
      james_findings: {
        id: "james_findings",
        speaker: "James",
        text: "Multiple people have reported use of force even when they were completely compliant. I'm talking about being thrown to the ground, zip-tied, having weapons drawn — against people who weren't resisting. Against people who committed no crime.",
        contentId: 7,
        choices: [
          { text: "Is there proof of this?", nextNodeId: "james_proof" },
          { text: "What about detention conditions?", nextNodeId: "james_detention" },
        ],
      },
      james_why: {
        id: "james_why",
        speaker: "James",
        text: "Because if nobody writes it down, they'll say it never happened. These are real people's stories. Someone has to make sure the truth gets out.",
        choices: [
          { text: "Tell me what you've documented.", nextNodeId: "james_findings" },
        ],
      },
      james_proof: {
        id: "james_proof",
        speaker: "James",
        text: "I have signed statements, medical reports, even some video from bystanders. Government oversight reports have confirmed patterns of excessive force. This isn't anecdotal — it's systematic.",
        choices: [
          { text: "What about conditions in detention?", nextNodeId: "james_detention" },
          { text: "How can people protect themselves?", nextNodeId: "james_protect" },
        ],
      },
      james_detention: {
        id: "james_detention",
        speaker: "James",
        text: "The detention facilities are overcrowded. People report being denied medical care, sleeping on concrete floors, being held in freezing rooms they call 'hieleras' — iceboxes. Families separated with no information about when they'll see each other again.",
        contentId: 11,
        choices: [
          { text: "This needs to be stopped.", nextNodeId: "james_protect" },
          { text: "Who is being held there?", nextNodeId: "james_who" },
        ],
      },
      james_who: {
        id: "james_who",
        speaker: "James",
        text: "Mothers. Fathers. Kids. People who've lived here for decades. People who've committed no crime other than existing in the wrong place at the wrong time. Some are even citizens who got swept up in the chaos.",
        choices: [
          { text: "What can be done?", nextNodeId: "james_protect" },
        ],
      },
      james_protect: {
        id: "james_protect",
        speaker: "James",
        text: "Document everything. If you witness an encounter, record it from a safe distance. Know your rights. And most importantly — don't stay silent. Silence is how they get away with it.",
        contentId: 14,
        choices: [
          { text: "Thank you for doing this work, James.", nextNodeId: "james_end" },
        ],
      },
      james_end: {
        id: "james_end",
        speaker: "James",
        text: "Thank you for listening. Most people look away. The fact that you're here, asking questions — that matters more than you know.",
        isEnd: true,
      },
    },
  },

  pastor_davis: {
    startNodeId: "pastor_start",
    nodes: {
      pastor_start: {
        id: "pastor_start",
        speaker: "Pastor Davis",
        text: "Welcome, child. These are troubling times. I've been holding know-your-rights workshops here at the center. Have you come to learn, or is there something specific on your mind?",
        choices: [
          { text: "What are these workshops about?", nextNodeId: "pastor_workshop" },
          { text: "How is the community holding up?", nextNodeId: "pastor_community" },
          { text: "What should people do if ICE comes?", nextNodeId: "pastor_ice" },
        ],
      },
      pastor_workshop: {
        id: "pastor_workshop",
        speaker: "Pastor Davis",
        text: "We teach people their constitutional rights. You do not have to open your door without a judicial warrant. You have the right to remain silent. You have the right to a lawyer. These rights belong to everyone — citizen or not.",
        contentId: 6,
        choices: [
          { text: "What's the difference between types of warrants?", nextNodeId: "pastor_warrant" },
          { text: "What else do you teach?", nextNodeId: "pastor_ice" },
        ],
      },
      pastor_community: {
        id: "pastor_community",
        speaker: "Pastor Davis",
        text: "The community is hurting, but it's also coming together in beautiful ways. Neighbors watching out for each other, people sharing food and resources. When they try to divide us, we find reasons to unite.",
        choices: [
          { text: "What are you teaching people?", nextNodeId: "pastor_workshop" },
          { text: "How can I help?", nextNodeId: "pastor_action" },
        ],
      },
      pastor_warrant: {
        id: "pastor_warrant",
        speaker: "Pastor Davis",
        text: "A judicial warrant is signed by a judge. An ICE administrative warrant is signed by an ICE agent — it does NOT give them the right to enter your home. Ask to see it slipped under the door. If it's not signed by a judge, you do not have to open that door.",
        contentId: 6,
        choices: [
          { text: "What else should people know?", nextNodeId: "pastor_ice" },
          { text: "How can I help spread this information?", nextNodeId: "pastor_action" },
        ],
      },
      pastor_ice: {
        id: "pastor_ice",
        speaker: "Pastor Davis",
        text: "If ICE comes to your door: Stay calm. Don't open the door. Ask for a warrant — a real judicial warrant. Say 'I am exercising my right to remain silent.' Have an emergency plan for your family. Know who to call.",
        contentId: 14,
        choices: [
          { text: "What kind of emergency plan?", nextNodeId: "pastor_plan" },
          { text: "Thank you, Pastor.", nextNodeId: "pastor_end" },
        ],
      },
      pastor_plan: {
        id: "pastor_plan",
        speaker: "Pastor Davis",
        text: "Designate someone to take care of your children. Have important documents in one place. Memorize a lawyer's phone number. Have a plan for who will handle your affairs. Prepare as a family so nobody is caught off guard.",
        contentId: 14,
        choices: [
          { text: "I'll help spread the word.", nextNodeId: "pastor_action" },
        ],
      },
      pastor_action: {
        id: "pastor_action",
        speaker: "Pastor Davis",
        text: "Attend a workshop. Bring your neighbors. Share what you learn. Call your representatives. Show up at council meetings. Vote. And above all — treat every person with dignity. That's how we change things.",
        contentId: 14,
        choices: [
          { text: "Thank you, Pastor Davis.", nextNodeId: "pastor_end" },
        ],
      },
      pastor_end: {
        id: "pastor_end",
        speaker: "Pastor Davis",
        text: "Go in peace, and carry this knowledge with you. An informed community is a protected community.",
        isEnd: true,
      },
    },
  },

  lawyer_kim: {
    startNodeId: "kim_start",
    nodes: {
      kim_start: {
        id: "kim_start",
        speaker: "Atty. Kim",
        text: "I'm Attorney Kim. I've been providing pro bono legal counsel to families affected by ICE enforcement in this area. What would you like to know?",
        choices: [
          { text: "What legal rights do people have?", nextNodeId: "kim_rights" },
          { text: "Can ICE enter homes without permission?", nextNodeId: "kim_warrant" },
          { text: "Have citizens been wrongfully targeted?", nextNodeId: "kim_citizens" },
        ],
      },
      kim_rights: {
        id: "kim_rights",
        speaker: "Atty. Kim",
        text: "Everyone in the United States has constitutional rights, regardless of immigration status. The Fourth Amendment protects against unreasonable searches. The Fifth Amendment gives you the right to remain silent. These are not privileges — they are rights.",
        contentId: 10,
        choices: [
          { text: "What about warrants?", nextNodeId: "kim_warrant" },
          { text: "What should someone do if detained?", nextNodeId: "kim_detained" },
        ],
      },
      kim_warrant: {
        id: "kim_warrant",
        speaker: "Atty. Kim",
        text: "This is critical: ICE administrative warrants do NOT give agents the legal authority to enter your home. Only a judicial warrant — signed by a federal judge — does. If they come to your door, ask to see the warrant. If it's not judicial, you have every right to keep that door closed.",
        contentId: 6,
        choices: [
          { text: "Have they been entering homes illegally?", nextNodeId: "kim_illegal" },
          { text: "What if someone gets detained?", nextNodeId: "kim_detained" },
        ],
      },
      kim_citizens: {
        id: "kim_citizens",
        speaker: "Atty. Kim",
        text: "Yes. I'm currently representing two cases where U.S. citizens were wrongfully detained. One was held for three weeks before they confirmed his citizenship. Davino Watson's case is the most well-known — he was actually deported despite being an American citizen.",
        contentId: 5,
        choices: [
          { text: "How does that even happen?", nextNodeId: "kim_how" },
          { text: "Is Davino here? I'd like to talk to him.", nextNodeId: "kim_davino" },
        ],
      },
      kim_illegal: {
        id: "kim_illegal",
        speaker: "Atty. Kim",
        text: "There have been documented cases. That's why it's so important for people to know: you do not have to open your door. Exercise your rights firmly but calmly. And if your rights are violated, document everything and contact a lawyer immediately.",
        choices: [
          { text: "Thank you for helping people.", nextNodeId: "kim_end" },
        ],
      },
      kim_how: {
        id: "kim_how",
        speaker: "Atty. Kim",
        text: "Systemic failures. Inadequate verification processes. Racial profiling. When agents are under pressure to meet quotas, shortcuts happen. And those shortcuts destroy real lives. The legal system is supposed to prevent this, but it's failing.",
        choices: [
          { text: "What can be done legally?", nextNodeId: "kim_detained" },
        ],
      },
      kim_davino: {
        id: "kim_davino",
        speaker: "Atty. Kim",
        text: "He should be around here somewhere. He's been brave enough to share his story publicly. Talking to him will give you a perspective no document can.",
        choices: [
          { text: "I'll find him. Thank you.", nextNodeId: "kim_end" },
        ],
      },
      kim_detained: {
        id: "kim_detained",
        speaker: "Atty. Kim",
        text: "If detained: give your name but exercise your right to remain silent beyond that. Ask for a lawyer immediately. Do not sign anything you don't understand. Have an emergency contact who knows your situation. And remember — you have rights.",
        contentId: 10,
        choices: [
          { text: "Thank you, Attorney Kim.", nextNodeId: "kim_end" },
        ],
      },
      kim_end: {
        id: "kim_end",
        speaker: "Atty. Kim",
        text: "Knowledge of the law is your strongest shield. Please share what you've learned with others. My office is always open.",
        isEnd: true,
      },
    },
  },

  davino: {
    startNodeId: "davino_start",
    nodes: {
      davino_start: {
        id: "davino_start",
        speaker: "Davino",
        text: "Hey. I'm Davino Watson. You might've heard my name around here. People keep saying I should tell my story. I guess... you want to hear it?",
        choices: [
          { text: "Only if you're comfortable sharing.", nextNodeId: "davino_story" },
          { text: "What happened to you?", nextNodeId: "davino_story" },
        ],
      },
      davino_story: {
        id: "davino_story",
        speaker: "Davino",
        text: "I'm an American citizen. Born in the U.S. But ICE detained me and deported me anyway. I kept telling them — I'm American. I have papers. They didn't listen. They just... sent me away. Like I didn't matter.",
        contentId: 8,
        choices: [
          { text: "How long were you gone?", nextNodeId: "davino_time" },
          { text: "How did it feel?", nextNodeId: "davino_feel" },
        ],
      },
      davino_time: {
        id: "davino_time",
        speaker: "Davino",
        text: "Years. Years of my life I'll never get back. While my family here didn't know where I was, couldn't reach me. I lost my job, my apartment, everything. All because someone decided I didn't look American enough.",
        contentId: 5,
        choices: [
          { text: "How did you get back?", nextNodeId: "davino_return" },
          { text: "I'm so sorry, Davino.", nextNodeId: "davino_now" },
        ],
      },
      davino_feel: {
        id: "davino_feel",
        speaker: "Davino",
        text: "Imagine being told you don't belong in your own country. That your birth certificate doesn't matter. That your whole identity is just... wrong. It breaks something inside you. I'm still putting the pieces back together.",
        choices: [
          { text: "How did you get back?", nextNodeId: "davino_return" },
        ],
      },
      davino_return: {
        id: "davino_return",
        speaker: "Davino",
        text: "Lawyers. Good people who wouldn't give up. People like Attorney Kim. But not everyone has that. Some people get deported and never come back. Some people die in those detention centers without anyone knowing.",
        contentId: 11,
        choices: [
          { text: "Why do you share your story?", nextNodeId: "davino_now" },
        ],
      },
      davino_now: {
        id: "davino_now",
        speaker: "Davino",
        text: "Because if one person hears it and it changes how they see this issue, it was worth it. I'm not special — what happened to me could happen to anyone who looks like me. And that's not okay in America.",
        choices: [
          { text: "Thank you for your courage, Davino.", nextNodeId: "davino_end" },
        ],
      },
      davino_end: {
        id: "davino_end",
        speaker: "Davino",
        text: "Thank you for listening. Really. Most people see the headlines and move on. You stopped. You listened. That's how change starts.",
        isEnd: true,
      },
    },
  },

  teacher_martinez: {
    startNodeId: "martinez_start",
    nodes: {
      martinez_start: {
        id: "martinez_start",
        speaker: "Ms. Martinez",
        text: "Oh, hello. I'm sorry, I was just grading papers. Well, trying to. It's hard to focus when half my students aren't showing up because their parents are afraid. Can I help you with something?",
        choices: [
          { text: "How are the kids handling all this?", nextNodeId: "martinez_kids" },
          { text: "What's happening with attendance?", nextNodeId: "martinez_attendance" },
          { text: "Are you okay, Ms. Martinez?", nextNodeId: "martinez_personal" },
        ],
      },
      martinez_kids: {
        id: "martinez_kids",
        speaker: "Ms. Martinez",
        text: "They're scared. Some have seen their parents taken. Others are afraid they'll come home and their family will be gone. One of my students — she's eight years old — asked me if she was going to be deported. She was born here.",
        contentId: 12,
        choices: [
          { text: "What are you telling them?", nextNodeId: "martinez_telling" },
          { text: "What about the Ramirez kids?", nextNodeId: "martinez_ramirez" },
        ],
      },
      martinez_attendance: {
        id: "martinez_attendance",
        speaker: "Ms. Martinez",
        text: "Down by a third. Parents are afraid to leave their homes, afraid to send their kids to school. These children are losing their education on top of everything else. The detention conditions families face are making it even worse.",
        contentId: 11,
        choices: [
          { text: "How are the kids coping?", nextNodeId: "martinez_kids" },
          { text: "Is the school doing anything?", nextNodeId: "martinez_school" },
        ],
      },
      martinez_personal: {
        id: "martinez_personal",
        speaker: "Ms. Martinez",
        text: "I became a teacher because I believe every child deserves a chance. Watching my students live in fear... it's the hardest thing I've ever faced. But I show up every day because they need someone who will.",
        choices: [
          { text: "How are the kids handling it?", nextNodeId: "martinez_kids" },
        ],
      },
      martinez_telling: {
        id: "martinez_telling",
        speaker: "Ms. Martinez",
        text: "I tell them the truth, age-appropriately. I tell them they have rights. I tell them they matter. Tommy — one of my older students — has actually been amazing. He's been teaching the younger kids about checkpoint rights in terms they can understand.",
        choices: [
          { text: "Can I talk to Tommy?", nextNodeId: "martinez_tommy" },
          { text: "Is the school helping?", nextNodeId: "martinez_school" },
        ],
      },
      martinez_ramirez: {
        id: "martinez_ramirez",
        speaker: "Ms. Martinez",
        text: "Sofia and Miguel. They're staying with neighbors now. Sofia draws pictures of her dad every day and asks me when he's coming back. I don't have an answer for her. I just hold her hand and tell her she's safe here.",
        choices: [
          { text: "Is there anything being done for them?", nextNodeId: "martinez_school" },
        ],
      },
      martinez_tommy: {
        id: "martinez_tommy",
        speaker: "Ms. Martinez",
        text: "He's usually around here somewhere. He's a remarkable kid — turned his fear into action. Started a 'Know Your Rights' club with the other students. These kids are braver than most adults I know.",
        choices: [
          { text: "I'll find him. Thank you.", nextNodeId: "martinez_end" },
        ],
      },
      martinez_school: {
        id: "martinez_school",
        speaker: "Ms. Martinez",
        text: "We've designated the school as a safe space. ICE cannot enter school grounds. We have counselors available. We're doing what we can, but we need the community behind us.",
        choices: [
          { text: "Thank you for everything you do.", nextNodeId: "martinez_end" },
        ],
      },
      martinez_end: {
        id: "martinez_end",
        speaker: "Ms. Martinez",
        text: "Thank you for caring. These kids need to know that people out there see them. If you can, tell others what's happening here. Their stories deserve to be heard.",
        isEnd: true,
      },
    },
  },

  tommy: {
    startNodeId: "tommy_start",
    nodes: {
      tommy_start: {
        id: "tommy_start",
        speaker: "Tommy",
        text: "Hey! Are you here for the Know Your Rights club? I started it with some friends. We figure if adults aren't going to protect us, we gotta protect ourselves, right?",
        choices: [
          { text: "That's really cool. What do you teach?", nextNodeId: "tommy_teach" },
          { text: "Aren't you kind of young for this?", nextNodeId: "tommy_age" },
          { text: "How did you learn about rights?", nextNodeId: "tommy_learn" },
        ],
      },
      tommy_teach: {
        id: "tommy_teach",
        speaker: "Tommy",
        text: "Okay so, number one: at a checkpoint, you have the right to remain silent. You don't have to answer questions about where you were born. Number two: you can refuse a search of your car. Number three: always record what's happening if it's safe to do so.",
        contentId: 13,
        choices: [
          { text: "What else?", nextNodeId: "tommy_more" },
          { text: "Where did you learn all this?", nextNodeId: "tommy_learn" },
        ],
      },
      tommy_age: {
        id: "tommy_age",
        speaker: "Tommy",
        text: "Maybe. But my friend's dad got taken away at a checkpoint. He didn't know he could say no to a search. He didn't know he could stay quiet. If someone had told him his rights, maybe he'd still be here.",
        choices: [
          { text: "I'm sorry about your friend. What rights do people have?", nextNodeId: "tommy_teach" },
        ],
      },
      tommy_learn: {
        id: "tommy_learn",
        speaker: "Tommy",
        text: "Pastor Davis taught me at first. Then I started reading everything I could find online. Attorney Kim helped me fact-check everything. Now I make little cards with rights printed on them and hand them out. In English and Spanish.",
        choices: [
          { text: "What's on the cards?", nextNodeId: "tommy_teach" },
          { text: "That's awesome. Can I have one?", nextNodeId: "tommy_card" },
        ],
      },
      tommy_more: {
        id: "tommy_more",
        speaker: "Tommy",
        text: "If ICE comes to your home, you don't have to open the door unless they have a warrant signed by a judge. Not an ICE warrant — those don't count for entering homes. And you can ask to see it through the window or slipped under the door.",
        contentId: 6,
        choices: [
          { text: "You really know your stuff, Tommy.", nextNodeId: "tommy_card" },
        ],
      },
      tommy_card: {
        id: "tommy_card",
        speaker: "Tommy",
        text: "Here you go! It says: 'I have the right to remain silent. I do not consent to a search. I want to speak to a lawyer.' Keep it in your wallet. Share it with your friends. Knowledge is power!",
        contentId: 10,
        choices: [
          { text: "Thanks, Tommy. Keep up the great work.", nextNodeId: "tommy_end" },
        ],
      },
      tommy_end: {
        id: "tommy_end",
        speaker: "Tommy",
        text: "Thanks! And hey — if you talk to anyone else around here, tell them about the club? The more people who know their rights, the safer we all are. Together we're stronger!",
        isEnd: true,
      },
    },
  },

  abuela: {
    startNodeId: "abuela_start",
    nodes: {
      abuela_start: {
        id: "abuela_start",
        speaker: "Abuela",
        text: "Mijo, come in, come in. Sit down. I made arroz con pollo — there's always enough. You look like you've been walking all over the neighborhood. What have you been up to?",
        choices: [
          { text: "I've been talking to people. Learning about what's happening.", nextNodeId: "abuela_learning" },
          { text: "How are you, Abuela?", nextNodeId: "abuela_how" },
          { text: "The neighborhood feels different.", nextNodeId: "abuela_different" },
        ],
      },
      abuela_learning: {
        id: "abuela_learning",
        speaker: "Abuela",
        text: "Good. That's good. Too many people close their eyes and pretend nothing is wrong. Your grandfather — he always said, 'The worst thing you can do is look away.' You have his spirit.",
        choices: [
          { text: "What have you seen happening?", nextNodeId: "abuela_seen" },
          { text: "How are you helping, Abuela?", nextNodeId: "abuela_helping" },
        ],
      },
      abuela_how: {
        id: "abuela_how",
        speaker: "Abuela",
        text: "These old bones? I'm fine. But my heart hurts for this neighborhood. I've lived here forty years. Raised my children here. This was always a place where people helped each other. Now everyone is scared.",
        choices: [
          { text: "What's changed?", nextNodeId: "abuela_seen" },
          { text: "Are you helping people?", nextNodeId: "abuela_helping" },
        ],
      },
      abuela_different: {
        id: "abuela_different",
        speaker: "Abuela",
        text: "It used to be full of life. Music on the weekends, kids playing in the park, families visiting. Now the streets are quiet. People draw their curtains and lock their doors. Fear does that — it makes the world smaller.",
        contentId: 12,
        choices: [
          { text: "What can we do about it?", nextNodeId: "abuela_helping" },
          { text: "What have you seen happen?", nextNodeId: "abuela_seen" },
        ],
      },
      abuela_seen: {
        id: "abuela_seen",
        speaker: "Abuela",
        text: "I watched them take the Martinez boy from right outside this window. He was carrying groceries. They didn't even let him put the bags down. His mother's milk was on the sidewalk for hours before someone cleaned it up. Nobody came outside. Everyone was too afraid.",
        contentId: 7,
        choices: [
          { text: "That's heartbreaking.", nextNodeId: "abuela_helping" },
        ],
      },
      abuela_helping: {
        id: "abuela_helping",
        speaker: "Abuela",
        text: "I do what I can. I cook for families who lost someone. I watch children whose parents are too afraid to go outside. Maria's kids come here after school now. I teach them songs and tell them stories. Normal things. Safe things.",
        choices: [
          { text: "You're amazing, Abuela.", nextNodeId: "abuela_wisdom" },
        ],
      },
      abuela_wisdom: {
        id: "abuela_wisdom",
        speaker: "Abuela",
        text: "I'm not amazing. I'm just a vieja who refuses to let fear win. In my country, I saw what happens when good people stay silent. I won't make that mistake here. This is my home. These are my people. And I will fight for them with arroz con pollo if that's all I have.",
        choices: [
          { text: "What should I do, Abuela?", nextNodeId: "abuela_advice" },
        ],
      },
      abuela_advice: {
        id: "abuela_advice",
        speaker: "Abuela",
        text: "Keep talking to people. Keep listening. Learn your rights and teach them to others. Don't be afraid. And always, always remember — we are stronger together than we are alone. Now eat before the food gets cold.",
        contentId: 14,
        choices: [
          { text: "Thank you, Abuela.", nextNodeId: "abuela_end" },
        ],
      },
      abuela_end: {
        id: "abuela_end",
        speaker: "Abuela",
        text: "Come back anytime, mijo. My door is always open. That's the whole point, isn't it? We keep our doors open for each other.",
        isEnd: true,
      },
    },
  },

  mama: {
    startNodeId: "mama_start",
    nodes: {
      mama_start: {
        id: "mama_start",
        speaker: "Mama",
        text: "You're back. I've been worried. I heard you've been walking around talking to everyone. Is everything okay?",
        choices: [
          { text: "I'm learning about what's happening to our neighbors.", nextNodeId: "mama_neighbors" },
          { text: "Are you scared, Mama?", nextNodeId: "mama_scared" },
          { text: "Did you know about the raids?", nextNodeId: "mama_raids" },
        ],
      },
      mama_neighbors: {
        id: "mama_neighbors",
        speaker: "Mama",
        text: "I know. I've been watching it happen. Mrs. Fernandez across the street — they took her husband last month. She hasn't heard from him. Their daughter asks about him every day at school.",
        choices: [
          { text: "Where do they take people?", nextNodeId: "mama_detention" },
          { text: "What are we going to do?", nextNodeId: "mama_action" },
        ],
      },
      mama_scared: {
        id: "mama_scared",
        speaker: "Mama",
        text: "Of course I'm scared. But I'm more scared of what happens if we do nothing. Fear is how they control us. If we stop living our lives, stop going to work, stop sending you to school — they win without even knocking on our door.",
        choices: [
          { text: "What can we do?", nextNodeId: "mama_action" },
          { text: "Tell me about the detention centers.", nextNodeId: "mama_detention" },
        ],
      },
      mama_raids: {
        id: "mama_raids",
        speaker: "Mama",
        text: "Everyone knows. We just don't talk about it in front of the children. But we should. We should prepare them. That's why I'm glad you're learning about this — you need to know your rights.",
        contentId: 9,
        choices: [
          { text: "What rights do we have?", nextNodeId: "mama_rights" },
          { text: "Where are people being taken?", nextNodeId: "mama_detention" },
        ],
      },
      mama_detention: {
        id: "mama_detention",
        speaker: "Mama",
        text: "To detention centers. The conditions are terrible — overcrowded, cold, people sleeping on floors. Families separated. Children taken from their parents. It's not justice. It's cruelty.",
        contentId: 11,
        choices: [
          { text: "What can we do about this?", nextNodeId: "mama_action" },
        ],
      },
      mama_rights: {
        id: "mama_rights",
        speaker: "Mama",
        text: "We have the right to remain silent. The right to not open our door without a warrant from a judge. The right to a lawyer. Pastor Davis has been teaching us at the community center. You should go listen.",
        contentId: 10,
        choices: [
          { text: "I talked to Pastor Davis already.", nextNodeId: "mama_action" },
          { text: "I'll make sure to go.", nextNodeId: "mama_action" },
        ],
      },
      mama_action: {
        id: "mama_action",
        speaker: "Mama",
        text: "We prepare. We know our rights. We stick together. We don't abandon our neighbors. And we speak up — call representatives, go to meetings, make our voices heard. This is our home, and we have every right to be here.",
        contentId: 14,
        choices: [
          { text: "I love you, Mama.", nextNodeId: "mama_end" },
        ],
      },
      mama_end: {
        id: "mama_end",
        speaker: "Mama",
        text: "I love you too. Now go — keep talking to people, keep learning. And come home safe. I'll be right here waiting.",
        isEnd: true,
      },
    },
  },

  officer_reyes: {
    startNodeId: "reyes_start",
    nodes: {
      reyes_start: {
        id: "reyes_start",
        speaker: "Officer Reyes",
        text: "I'm Officer Reyes, local PD. Look, I know people are scared of anyone in uniform right now. But I want you to know — local police and ICE are NOT the same thing. I'm here to serve this community.",
        choices: [
          { text: "What's the difference between local police and ICE?", nextNodeId: "reyes_difference" },
          { text: "Are local police helping ICE?", nextNodeId: "reyes_cooperation" },
          { text: "How can people trust you?", nextNodeId: "reyes_trust" },
        ],
      },
      reyes_difference: {
        id: "reyes_difference",
        speaker: "Officer Reyes",
        text: "Local police handle local crimes — theft, safety, traffic. ICE is a federal agency focused on immigration enforcement. In many cities, there are policies that prevent local police from asking about immigration status or cooperating with ICE detainers.",
        choices: [
          { text: "Does our city cooperate with ICE?", nextNodeId: "reyes_cooperation" },
          { text: "What should people do if they see ICE?", nextNodeId: "reyes_advice" },
        ],
      },
      reyes_cooperation: {
        id: "reyes_cooperation",
        speaker: "Officer Reyes",
        text: "I can tell you that I personally do not ask about immigration status. My job is to keep everyone safe. When people are afraid to call the police, crimes go unreported. That makes the whole neighborhood less safe.",
        choices: [
          { text: "What advice do you have for the community?", nextNodeId: "reyes_advice" },
        ],
      },
      reyes_trust: {
        id: "reyes_trust",
        speaker: "Officer Reyes",
        text: "Trust is earned, not demanded. I've been walking these streets, talking to people, showing up. I was born in this neighborhood. My family is here. I became a cop to protect my people, not to tear them apart.",
        choices: [
          { text: "What's your advice for people who are scared?", nextNodeId: "reyes_advice" },
        ],
      },
      reyes_advice: {
        id: "reyes_advice",
        speaker: "Officer Reyes",
        text: "Know the difference between local police and ICE. If you see ICE activity, you have the right to observe and record from a safe distance. And call your local police if you see something that isn't right. We're here to help.",
        contentId: 13,
        choices: [
          { text: "Thanks, Officer Reyes.", nextNodeId: "reyes_end" },
        ],
      },
      reyes_end: {
        id: "reyes_end",
        speaker: "Officer Reyes",
        text: "Stay safe out there. And remember — you can always come to me. I'm on your side.",
        isEnd: true,
      },
    },
  },

  lucia: {
    startNodeId: "lucia_start",
    nodes: {
      lucia_start: {
        id: "lucia_start",
        speaker: "Lucia",
        text: "Shh, keep your voice down. I'm organizing a supply drive for families who've been affected. Water, food, clothes for the kids. You want to help?",
        choices: [
          { text: "Absolutely. What do you need?", nextNodeId: "lucia_needs" },
          { text: "Who are you helping?", nextNodeId: "lucia_who" },
          { text: "Isn't this risky?", nextNodeId: "lucia_risk" },
        ],
      },
      lucia_needs: {
        id: "lucia_needs",
        speaker: "Lucia",
        text: "Right now? Everything. But mostly we need people to spread the word — quietly. We need volunteers to deliver supplies so families don't have to leave their homes. And we need legal aid contacts for people who've been detained.",
        choices: [
          { text: "Who's been detained?", nextNodeId: "lucia_who" },
          { text: "I can help with deliveries.", nextNodeId: "lucia_deliver" },
        ],
      },
      lucia_who: {
        id: "lucia_who",
        speaker: "Lucia",
        text: "Families all over this neighborhood. Some lost their breadwinner overnight. Kids going hungry because their parent was taken at a workplace raid and there's no one to buy groceries. These are our neighbors.",
        contentId: 9,
        choices: [
          { text: "How many families?", nextNodeId: "lucia_scale" },
          { text: "I want to help.", nextNodeId: "lucia_deliver" },
        ],
      },
      lucia_risk: {
        id: "lucia_risk",
        speaker: "Lucia",
        text: "Maybe. But what's the alternative? Let families go hungry? Let kids suffer? I refuse to sit by while my community falls apart. Being brave doesn't mean being unafraid — it means doing the right thing even when you are.",
        choices: [
          { text: "You're right. How can I help?", nextNodeId: "lucia_needs" },
        ],
      },
      lucia_scale: {
        id: "lucia_scale",
        speaker: "Lucia",
        text: "At least a dozen that I know of, just on these few blocks. And those are only the ones who've asked for help. Many more are suffering in silence because they're too afraid to reach out.",
        choices: [
          { text: "What can I do?", nextNodeId: "lucia_deliver" },
        ],
      },
      lucia_deliver: {
        id: "lucia_deliver",
        speaker: "Lucia",
        text: "Talk to people. Let them know help is available. And most importantly — be a witness. Document what's happening. Tell others. The world needs to know what's going on in neighborhoods like ours.",
        contentId: 14,
        choices: [
          { text: "I'll do everything I can.", nextNodeId: "lucia_end" },
        ],
      },
      lucia_end: {
        id: "lucia_end",
        speaker: "Lucia",
        text: "Thank you. Every hand makes a difference. Come find me at the park if you learn anything new. We're in this together.",
        isEnd: true,
      },
    },
  },

  mr_park: {
    startNodeId: "park_start",
    nodes: {
      park_start: {
        id: "park_start",
        speaker: "Mr. Park",
        text: "Welcome to... well, what used to be my restaurant. Had to close three weeks ago. Can't keep staff when everyone's afraid to come to work. Thirty years of building this place, and it's just... empty now.",
        choices: [
          { text: "I'm sorry, Mr. Park. What happened?", nextNodeId: "park_story" },
          { text: "Why did your staff stop coming?", nextNodeId: "park_staff" },
        ],
      },
      park_story: {
        id: "park_story",
        speaker: "Mr. Park",
        text: "After the workplace raids started, my kitchen staff was terrified. Half of them stopped showing up — not because they were taken, but because they were afraid they'd be next. I couldn't run a restaurant with two people.",
        contentId: 9,
        choices: [
          { text: "Will you reopen?", nextNodeId: "park_future" },
          { text: "How is this affecting the neighborhood?", nextNodeId: "park_neighborhood" },
        ],
      },
      park_staff: {
        id: "park_staff",
        speaker: "Mr. Park",
        text: "The raids. After they hit the factory, everyone in the service industry panicked. These people aren't criminals — they're cooks, dishwashers, servers who just want to earn a living and take care of their families.",
        contentId: 9,
        choices: [
          { text: "What will happen to the neighborhood?", nextNodeId: "park_neighborhood" },
        ],
      },
      park_neighborhood: {
        id: "park_neighborhood",
        speaker: "Mr. Park",
        text: "Three businesses on this block alone have closed. The laundromat, the bodega, my place. The economy of a neighborhood runs on trust, and that trust is broken. When people are afraid to exist in public, everything falls apart.",
        contentId: 12,
        choices: [
          { text: "Is there any hope?", nextNodeId: "park_future" },
        ],
      },
      park_future: {
        id: "park_future",
        speaker: "Mr. Park",
        text: "I have to believe there is. This community has survived hard times before. But we need people to pay attention, to speak up. Go talk to others. Make sure people outside this neighborhood know what's happening here.",
        choices: [
          { text: "I will, Mr. Park.", nextNodeId: "park_end" },
        ],
      },
      park_end: {
        id: "park_end",
        speaker: "Mr. Park",
        text: "Thank you. And tell people — when this is over, the restaurant will reopen. This community will come back. I have to believe that.",
        isEnd: true,
      },
    },
  },

  sofia: {
    startNodeId: "sofia_start",
    nodes: {
      sofia_start: {
        id: "sofia_start",
        speaker: "Sofia",
        text: "Are you a friend of Ms. Martinez? She said nice people might come talk to us. I'm drawing a picture. Want to see?",
        choices: [
          { text: "I'd love to see your drawing.", nextNodeId: "sofia_drawing" },
          { text: "Hi Sofia. How are you doing?", nextNodeId: "sofia_how" },
        ],
      },
      sofia_drawing: {
        id: "sofia_drawing",
        speaker: "Sofia",
        text: "It's my family. See? That's Mama, and that's my brother Miguel, and that's Papa. Papa isn't here right now. The people in the van took him. But Ms. Martinez says he'll come back.",
        choices: [
          { text: "I hope he comes back soon too.", nextNodeId: "sofia_hope" },
          { text: "Do you miss him?", nextNodeId: "sofia_miss" },
        ],
      },
      sofia_how: {
        id: "sofia_how",
        speaker: "Sofia",
        text: "Okay I guess. I miss my house. We're staying with Mrs. Rodriguez now. She's nice but it's not the same. Miguel cries at night but I tell him it's gonna be okay.",
        choices: [
          { text: "You're very brave, Sofia.", nextNodeId: "sofia_brave" },
        ],
      },
      sofia_miss: {
        id: "sofia_miss",
        speaker: "Sofia",
        text: "Every day. He used to make me pancakes before school. Now nobody makes pancakes. I saved one of his shirts 'cause it smells like him. Is that weird?",
        choices: [
          { text: "That's not weird at all. That's love.", nextNodeId: "sofia_hope" },
        ],
      },
      sofia_brave: {
        id: "sofia_brave",
        speaker: "Sofia",
        text: "That's what Mama says too. She says we have to be brave for Papa. Tommy taught me that we have rights. He gave me a card with words on it. I don't understand all of them yet but I keep it in my pocket.",
        contentId: 10,
        choices: [
          { text: "Those are important words, Sofia.", nextNodeId: "sofia_hope" },
        ],
      },
      sofia_hope: {
        id: "sofia_hope",
        speaker: "Sofia",
        text: "Do you think you can help my Papa come home? Ms. Martinez says people are working on it. I just want things to go back to normal. I just want my Papa.",
        choices: [
          { text: "I'm going to try my best.", nextNodeId: "sofia_end" },
        ],
      },
      sofia_end: {
        id: "sofia_end",
        speaker: "Sofia",
        text: "Thank you. Here — you can have this drawing. It's so you remember my Papa. His name is Miguel Ramirez. Please don't forget him, okay?",
        isEnd: true,
      },
    },
  },
};
