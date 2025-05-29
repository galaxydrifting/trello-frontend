export interface Card {
  id: string;
  title: string;
  content: string;
  position: number;
  listId: string;
  boardId: string;
}

export interface List {
  id: string;
  name: string;
  boardId: string;
  position: number;
  cards: Card[];
}

export interface Board {
  id: string;
  name: string;
  position: number;
  lists: List[];
}
