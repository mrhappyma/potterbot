import { AxiosResponse } from "axios";
import { potterDbBaseData } from "./base";

export type potterDbMovieAtributes = {
  [key: string]: string | string[] | null;
  slug: string;
  title: string;
  summary: string;
  directors: string[];
  screenwriters: string[];
  producers: string[];
  cinematographers: string[];
  editors: string[];
  distributors: string[];
  music_composers: string[];
  release_date: string;
  running_time: string;
  budget: string;
  box_office: string;
  rating: string;
  order: string;
  trailer: string;
  poster: string | null;
  wiki: string;
};

interface potterDbMovieResponseData extends potterDbBaseData {
  id: string;
  type: "movie";
  attributes: potterDbMovieAtributes;
}

export interface potterDbMovieResponse extends AxiosResponse {
  data: potterDbMovieResponseData;
}

export interface potterDbAllMoviesResponse extends AxiosResponse {
  data: potterDbMovieResponseData[];
}
