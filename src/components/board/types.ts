export interface Card {
  id: string;
  title: string;
  content: string;
}

export interface List {
  id: string;
  name: string;
  cards: Card[];
}

export interface Board {
  id: string;
  name: string;
  position: number;
  lists: List[];
}
