export interface IEntity {
  id?: string;
}

export interface IPagination<T> {
  totalLength: number;
  data: T[];
}

export interface ICoworker extends IEntity {
  name: string;
  city?: string;
  country?: string;
  text: string;
  imageFullUrl?: string;
  imagePortraitUrl?: string;
  coworkerDetailsPath?: string;
}
