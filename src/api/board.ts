import { postGraphQL } from './postGraphQL';
import { Board, List, Card } from '../components/board/types';

const BOARDS_QUERY = `query { boards { id name position } }`;
const BOARD_DETAIL_QUERY = `query BoardDetail($id: ID!) {
  board(id: $id) {
    id
    name
    lists {
      id
      name
      cards {
        id
        title
        content
      }
    }
  }
}`;
const CREATE_BOARD_MUTATION = `mutation CreateBoard($input: CreateBoardInput!) {
  createBoard(input: $input) {
    id
    name
    position
  }
}`;
const CREATE_LIST_MUTATION = `mutation CreateList($input: CreateListInput!) {
  createList(input: $input) {
    id
    name
    boardId
    position
  }
}`;
const CREATE_CARD_MUTATION = `mutation CreateCard($input: CreateCardInput!) {
  createCard(input: $input) {
    id
    title
    content
    position
    listId
    boardId
  }
}`;
const UPDATE_BOARD_MUTATION = `mutation UpdateBoard($input: UpdateBoardInput!) {
  updateBoard(input: $input) {
    id
    name
    position
  }
}`;

const DELETE_BOARD_MUTATION = `mutation DeleteBoard($id: ID!) {
  deleteBoard(id: $id)
}`;

const UPDATE_LIST_MUTATION = `mutation UpdateList($input: UpdateListInput!) {
  updateList(input: $input) {
    id
    name
    position
    boardId
  }
}`;

const DELETE_LIST_MUTATION = `mutation DeleteList($id: ID!) {
  deleteList(id: $id)
}`;

const UPDATE_CARD_MUTATION = `mutation UpdateCard($input: UpdateCardInput!) {
  updateCard(input: $input) {
    id
    title
    content
  }
}`;

const DELETE_CARD_MUTATION = `mutation DeleteCard($id: ID!) {
  deleteCard(id: $id)
}`;

const MOVE_LIST_MUTATION = `mutation MoveList($input: MoveListInput!) {
  moveList(input: $input) {
    id
    name
    position
    boardId
  }
}`;

const MOVE_CARD_MUTATION = `mutation MoveCard($input: MoveCardInput!) {
  moveCard(input: $input) {
    id
    title
    content
    position
    listId
  }
}`;

export const fetchBoards = async (): Promise<Board[]> => {
  const data = await postGraphQL<{ boards: Board[] }>(BOARDS_QUERY);
  return data.boards;
};

export const fetchBoard = async (boardId: string): Promise<Board> => {
  const data = await postGraphQL<{ board: Board }>(BOARD_DETAIL_QUERY, { id: boardId });
  return data.board;
};

export const createBoard = async (name: string, position: number): Promise<Board> => {
  const data = await postGraphQL<{ createBoard: Board }>(CREATE_BOARD_MUTATION, {
    input: { name, position },
  });
  return data.createBoard;
};

export const createList = async (boardId: string, name: string): Promise<List> => {
  const data = await postGraphQL<{ createList: List }>(CREATE_LIST_MUTATION, {
    input: { boardId, name },
  });
  return data.createList;
};

export const createCard = async (
  boardId: string,
  listId: string,
  title: string,
  content: string
): Promise<Card> => {
  const data = await postGraphQL<{ createCard: Card }>(CREATE_CARD_MUTATION, {
    input: { boardId, listId, title, content },
  });
  return data.createCard;
};

export const updateBoard = async (id: string, name: string): Promise<Board> => {
  const data = await postGraphQL<{ updateBoard: Board }>(UPDATE_BOARD_MUTATION, {
    input: { id, name },
  });
  return data.updateBoard;
};

export const deleteBoard = async (id: string): Promise<boolean> => {
  const data = await postGraphQL<{ deleteBoard: boolean }>(DELETE_BOARD_MUTATION, { id });
  return data.deleteBoard;
};

export const updateList = async (id: string, name: string): Promise<List> => {
  const data = await postGraphQL<{ updateList: List }>(UPDATE_LIST_MUTATION, {
    input: { id, name },
  });
  return data.updateList;
};

export const deleteList = async (id: string): Promise<boolean> => {
  const data = await postGraphQL<{ deleteList: boolean }>(DELETE_LIST_MUTATION, { id });
  return data.deleteList;
};

export const updateCard = async (id: string, title: string, content: string): Promise<Card> => {
  const data = await postGraphQL<{ updateCard: Card }>(UPDATE_CARD_MUTATION, {
    input: { id, title, content },
  });
  return data.updateCard;
};

export const deleteCard = async (id: string): Promise<boolean> => {
  const data = await postGraphQL<{ deleteCard: boolean }>(DELETE_CARD_MUTATION, { id });
  return data.deleteCard;
};

export const moveList = async (id: string, newPosition: number): Promise<List> => {
  const data = await postGraphQL<{ moveList: List }>(MOVE_LIST_MUTATION, {
    input: { id, newPosition },
  });
  return data.moveList;
};

export const moveCard = async (
  id: string,
  targetListId: string,
  newPosition: number
): Promise<Card> => {
  const data = await postGraphQL<{ moveCard: Card }>(MOVE_CARD_MUTATION, {
    input: { id, targetListId, newPosition },
  });
  return data.moveCard;
};
