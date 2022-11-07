export type potterDbBaseData = {
  id: string;
  type: "book" | "spell" | "character" | "movie" | "potion" | "spell";
  links: potterDbLinks;
  meta: potterDbMeta;
};

type potterDbMeta = {
  copyright: string;
  generated_at: string;
};

type potterDbLinks = {
  self: string;
};
