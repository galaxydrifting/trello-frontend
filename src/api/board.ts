import apiClient from './config';
import { Board } from '../components/board/types';

const BOARDS_QUERY = `query { boards { id name } }`;
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
const CREATE_LIST_MUTATION = `mutation CreateList($input: CreateListInput!) {
  createList(input: $input) {
    id
    name
    cards {
      id
      title
      content
    }
  }
}`;
const CREATE_CARD_MUTATION = `mutation CreateCard($input: CreateCardInput!) {
  createCard(input: $input) {
    id
    title
    content
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

export const createBoard = async (name: string): Promise<Board> => {
  const res = await apiClient.post('/graphql/query', {
    query: CREATE_BOARD_MUTATION,
    variables: { input: { name } },
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

export const createCard = async (listId: string, title: string, content: string) => {
  const res = await apiClient.post('/graphql/query', {
    query: CREATE_CARD_MUTATION,
    variables: { input: { listId, title, content } },
  });
  return res.data.data.createCard;
};
