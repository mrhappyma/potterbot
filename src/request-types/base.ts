export type potterDbBaseData = {
  links: potterDbLinks;
  meta: potterDbMeta;
};

type potterDbMeta = {
  copyright: string;
  generated_at: string;
  pagination: potterDbPagination;
};

type potterDbPagination = {
  current: number;
  next: number;
  last: number;
  records: number;
};

type potterDbLinks = {
  self: string;
};
