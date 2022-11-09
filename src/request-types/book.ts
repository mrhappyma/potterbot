import { AxiosResponse } from "axios";
import { potterDbBaseData } from "./base";

export type potterDbBookAtributes = {
  [key: string]: string | number | null;
  slug: string;
  title: string;
  summary: string;
  author: string;
  release_date: string;
  dedication: string | null;
  pages: number;
  order: number;
  cover: string;
  wiki: string;
};

type potterDbBookRelationships = {
  chapters: potterDbBookRelationshipsChapters;
};

type potterDbBookRelationshipsChapters = {
  data: potterDbBookRelationshipsChaptersData[];
};

type potterDbBookRelationshipsChaptersData = {
  id: string;
  type: "chapter";
};

interface potterDbBookResponseData extends potterDbBaseData {
  id: string;
  type: "book";
  attributes: potterDbBookAtributes;
  relationships: potterDbBookRelationships;
}

export interface potterDbBookResponse extends AxiosResponse {
  data: potterDbBookResponseData;
}

export interface potterDbAllBooksResponse extends AxiosResponse {
  data: potterDbBookResponseData[];
}
