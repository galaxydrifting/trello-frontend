import apiClient from './config';
import { Board } from '../components/board/types';

const BOARDS_QUERY = `query { boards { id name } }`;

export const fetchBoards = async (): Promise<Board[]> => {
  const res = await apiClient.post('/graphql/query', {
    query: BOARDS_QUERY,
  });
  return res.data.data.boards;
};
