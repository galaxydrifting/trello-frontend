import apiClient from './config';

/**
 * 通用 GraphQL 請求 function，回傳型別由呼叫端指定。
 * @param query GraphQL 查詢或 mutation 字串
 * @param variables 變數物件（可選）
 */
export const postGraphQL = async <T>(query: string, variables?: object): Promise<T> => {
  try {
    const res = await apiClient.post('/graphql/query', { query, variables });
    return res.data.data as T;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
};
