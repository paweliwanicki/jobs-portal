import { useCallback, useState } from 'react';
import { HttpMethod } from '../enums/HttpMethods';

export type RequestOptions = {
  path: string;
  payload?: string;
  contentType?: string;
};

export type ResponseParams = {
  statusCode: number;
  message?: string;
};

type ApiService = {
  isFetching: boolean;
  fetch: <T>(
    method: HttpMethod,
    params: RequestOptions
  ) => Promise<[body: T, resParams: ResponseParams]>;
};

const request = async (
  method: HttpMethod,
  params: RequestOptions
): Promise<[body: any, resParams: ResponseParams]> => {
  let body = null;
  const { path, payload, contentType } = params;

  const response = await fetch(path, {
    method,
    body: payload,
    headers: {
      'Content-Type': contentType ? contentType : 'application/json',
    },
  });

  try {
    body = (await response.json()) as ResponseParams;
  } catch {
    console.error('Error while parsing the response :(');
  }

  return [body, { statusCode: response.status, message: response.statusText }];
};

export const useApi = (): ApiService => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const fetch = useCallback(
    async (method: HttpMethod, params: RequestOptions) => {
      setIsFetching(true);
      const response = await request(method, params);
      setIsFetching(false);
      return response;
    },
    []
  );

  return {
    isFetching,
    fetch,
  };
};
