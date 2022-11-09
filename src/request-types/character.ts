import { AxiosResponse } from "axios";
import { potterDbBaseData } from "./base";

export type potterDbCharacterAtributes = {
  [key: string]: string | string[] | null;
  slug: string;
  name: string;
  born: string | null;
  died: string | null;
  gender: string | null;
  species: string | null;
  height: string | null;
  weight: string | null;
  hair_color: string | null;
  eye_color: string | null;
  skin_color: string | null;
  blood_status: string | null;
  marital_status: string | null;
  nationality: string | null;
  animagus: string | null;
  boggart: string | null;
  house: string | null;
  patronus: string | null;
  alias_names: string[] | null;
  family_members: string[] | null;
  jobs: string[] | null;
  romances: string[] | null;
  titles: string[] | null;
  wands: string[] | null;
  image: string | null;
  wiki: string | null;
};

interface potterDbCharacterResponseData extends potterDbBaseData {
  id: string;
  type: "character";
  attributes: potterDbCharacterAtributes;
}

export interface potterDbCharacterResponse extends AxiosResponse {
  data: potterDbCharacterResponseData;
}

export interface potterDbAllCharactersResponse extends AxiosResponse {
  data: potterDbCharacterResponseData[];
}
