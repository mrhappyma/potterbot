import { AxiosResponse } from "axios";
import { potterDbBaseData } from "./base";

export type potterDbPotionAtributes = {
  [key: string]: string | null;
  slug: string;
  name: string;
  effect: string;
  side_effects: string | null;
  characteristics: string | null;
  time: string | null;
  difficulty: string | null;
  ingredients: string | null;
  inventors: string | null;
  manufacturers: string | null;
  image: string | null;
  wiki: string | null;
};

interface potterDbPotionResponseData extends potterDbBaseData {
  id: string;
  type: "book" | "spell" | "character" | "movie" | "potion" | "spell";
  attributes: potterDbPotionAtributes;
}

export interface potterDbPotionResponse extends AxiosResponse {
  data: potterDbPotionResponseData;
}

export interface potterDbAllPotionsResponse extends AxiosResponse {
  data: potterDbPotionResponseData[];
}
