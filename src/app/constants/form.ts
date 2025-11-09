import type { DefaultValues } from "react-hook-form";
import { z } from "zod";

export const ratingScale = ["5", "4", "3", "2", "1"] as const;

export const requiredMessage = "この質問は必須です";

export const formSchema = z.object({
  name: z.string().min(1, requiredMessage),
  boldness: z.enum(ratingScale, { message: requiredMessage }),
  execution: z.enum(ratingScale, { message: requiredMessage }),
  humor: z.enum(ratingScale, { message: requiredMessage }),
  creativity: z.enum(ratingScale, { message: requiredMessage }),
  presentation: z.enum(ratingScale, { message: requiredMessage }),
  comment: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export const radioQuestions = [
  {
    name: "boldness",
    label: "Boldness of Theft",
    helper: "Did you snatch that idea with savage confidence or play it safe?",
  },
  {
    name: "execution",
    label: "Execution & Improvement",
    helper:
      "You stole it, but did you glow-up the stolen goods or just copy-paste?",
  },
  {
    name: "humor",
    label: "Humor / Branding",
    helper: "Does it make us LOL and stick in our heads, or nah?",
  },
  {
    name: "creativity",
    label: "Creativity in Rebranding",
    helper: "Can you flip the script so it feels fresh, not recycled?",
  },
  {
    name: "presentation",
    label: "Presentation",
    helper: "Did you sell it like a pro, or drop it like a half-baked meme?",
  },
] as const satisfies ReadonlyArray<{
  name: keyof Pick<
    FormValues,
    "boldness" | "execution" | "humor" | "creativity" | "presentation"
  >;
  label: string;
  helper: string;
}>;

export const ratingOptions = ratingScale.map((value) => ({
  value,
  label: value,
}));

export const defaultValues: DefaultValues<FormValues> = {
  name: "",
  boldness: undefined,
  execution: undefined,
  humor: undefined,
  creativity: undefined,
  presentation: undefined,
  comment: "",
};
