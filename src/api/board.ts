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
