import { Response } from 'express';

export interface PageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function getPagination(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPageMeta(
  page: number,
  limit: number,
  totalItems: number,
): PageMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return { page, limit, totalItems, totalPages };
}

export function setPaginationLinks(
  response: Response,
  basePath: string,
  page: number,
  limit: number,
  totalPages: number,
) {
  const links: string[] = [];

  if (page > 1) {
    links.push(`<${basePath}?page=${page - 1}&limit=${limit}>; rel="prev"`);
  }

  if (page < totalPages) {
    links.push(`<${basePath}?page=${page + 1}&limit=${limit}>; rel="next"`);
  }

  if (links.length > 0) {
    response.setHeader('Link', links.join(', '));
  }
}