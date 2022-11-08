import { AxiosResponse } from "axios";
import { potterDbBaseData } from "./base";

export type potterDbSpellAtributes = {
  [key: string]: string | null;
  slug: string;
  name: string;
  incantation: string | null;
  category: string;
  effect: string;
  light: string | null;
  hand: string | null;
  creator: string | null;
  image: string | null;
  wiki: string | null;
};

interface potterDbSpellResponseData extends potterDbBaseData {
  attributes: potterDbSpellAtributes;
}

export interface potterDbSpellResponse extends AxiosResponse {
  data: potterDbSpellResponseData;
}

export interface potterDbAllSpellsResponse extends AxiosResponse {
  data: potterDbSpellResponseData[];
}
