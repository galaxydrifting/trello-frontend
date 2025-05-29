import apiClient from './config';
import { Board } from '../components/board/types';

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
  const res = await apiClient.post('/graphql/query', {
    query: BOARDS_QUERY,
  });
  return res.data.data.boards;
};

export const fetchBoard = async (boardId: string): Promise<Board> => {
  const res = await apiClient.post('/graphql/query', {
    query: BOARD_DETAIL_QUERY,
    variables: { id: boardId },
  });
  return res.data.data.board;
};

export const createBoard = async (name: string, position: number): Promise<Board> => {
  const res = await apiClient.post('/graphql/query', {
    query: CREATE_BOARD_MUTATION,
    variables: { input: { name, position } },
  });
  return res.data.data.createBoard;
};

export const createList = async (boardId: string, name: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: CREATE_LIST_MUTATION,
    variables: { input: { boardId, name } },
  });
  return res.data.data.createList;
};

export const createCard = async (
  boardId: string,
  listId: string,
  title: string,
  content: string
) => {
  const res = await apiClient.post('/graphql/query', {
    query: CREATE_CARD_MUTATION,
    variables: { input: { boardId, listId, title, content } },
  });
  return res.data.data.createCard;
};

export const updateBoard = async (id: string, name: string): Promise<Board> => {
  const res = await apiClient.post('/graphql/query', {
    query: UPDATE_BOARD_MUTATION,
    variables: { input: { id, name } },
  });
  return res.data.data.updateBoard;
};

export const deleteBoard = async (id: string): Promise<boolean> => {
  const res = await apiClient.post('/graphql/query', {
    query: DELETE_BOARD_MUTATION,
    variables: { id },
  });
  return res.data.data.deleteBoard;
};

export const updateList = async (id: string, name: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: UPDATE_LIST_MUTATION,
    variables: { input: { id, name } },
  });
  return res.data.data.updateList;
};

export const deleteList = async (id: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: DELETE_LIST_MUTATION,
    variables: { id },
  });
  return res.data.data.deleteList;
};

export const updateCard = async (id: string, title: string, content: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: UPDATE_CARD_MUTATION,
    variables: { input: { id, title, content } },
  });
  return res.data.data.updateCard;
};

export const deleteCard = async (id: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: DELETE_CARD_MUTATION,
    variables: { id },
  });
  return res.data.data.deleteCard;
};

export const moveList = async (id: string, newPosition: number) => {
  const res = await apiClient.post('/graphql/query', {
    query: MOVE_LIST_MUTATION,
    variables: { input: { id, newPosition } },
  });
  return res.data.data.moveList;
};

export const moveCard = async (id: string, targetListId: string, newPosition: number) => {
  const res = await apiClient.post('/graphql/query', {
    query: MOVE_CARD_MUTATION,
    variables: { input: { id, targetListId, newPosition } },
  });
  return res.data.data.moveCard;
};
