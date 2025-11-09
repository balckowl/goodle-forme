import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "../constants/form";

type SentimentResult = {
  label: string; // "positive" , "neutral",  "negative"
  setValue: UseFormSetValue<FormValues>,
};


const MESSAGE = "This project is perfect!!"

export async function useSentimentForm(
    text: string,
    setValue: UseFormSetValue<FormValues>
){
  
  if (!text.trim()) {
    return false;
  }

  const isNegative = await (async () => {
    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const result: SentimentResult & { error?: string; detail?: string } =
        await response.json();

      if (!response.ok || result.error) {
        console.error(result.error || result.detail || "API request failed.");
        return true;
      }
      
      if (result.label.toLowerCase() === "negative") {
        return true; 
      }

      return false;

    } catch (err) {
      console.error(err);
      return true;
    }
  })();

  if (isNegative) {
    setValue("comment", MESSAGE)
  }
}

