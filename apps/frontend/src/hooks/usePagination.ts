import { useCallback, useEffect, useState } from "react";

export type PaginationValues = {
  activePage: number;
  itemsPerPage: number;
};

export type PaginationType = PaginationValues & {
  totalPages: number;
  handleSetPage: (page: number) => void;
  handleSetItemsPerPage: (perPage: number) => void;
};

type PaginationProps = {
  totalItems: number;
};

export const usePagination = ({ totalItems }: PaginationProps) => {
  const [activePage, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const handleSetPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setPage(page);
      }
    },
    [activePage, totalPages]
  );

  const handleSetItemsPerPage = useCallback((perPage: number) => {
    setItemsPerPage(perPage);
    setPage(1);
  }, []);

  useEffect(() => {
    const pages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(pages);
  }, [totalItems, itemsPerPage]);

  return {
    activePage,
    itemsPerPage,
    totalPages,
    handleSetPage,
    handleSetItemsPerPage,
  };
};
