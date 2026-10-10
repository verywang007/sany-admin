import { useCallback, useEffect, useRef, useState } from 'react';
import type { TablePaginationConfig } from 'antd';
import type { ListFetcher } from '@/types/common';

interface Options<Q> {
  defaultPageSize?: number;
  /** 首次渲染是否自动查询，默认 true */
  immediate?: boolean;
  initialQuery?: Q;
}

/**
 * 列表页通用状态：查询条件、分页、加载态。
 * 用法：const { tableProps, search, reset } = useTableQuery(fetchXxx);
 *       <SearchForm onSearch={search} onReset={reset} />
 *       <DataTable {...tableProps} columns={columns} />
 */
export function useTableQuery<T, Q extends Record<string, unknown> = Record<string, unknown>>(
  fetcher: ListFetcher<T, Q>,
  { defaultPageSize = 20, immediate = true, initialQuery }: Options<Q> = {},
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queried, setQueried] = useState(immediate);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const queryRef = useRef<Q>((initialQuery ?? {}) as Q);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async (p: number, size: number) => {
    setLoading(true);
    try {
      const res = await fetcherRef.current({ ...queryRef.current, page: p, pageSize: size });
      setData(res.list);
      setTotal(res.total);
      setPage(p);
      setPageSize(size);
      setQueried(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) run(1, defaultPageSize);
    // 仅首次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(
    (query: Q) => {
      queryRef.current = query;
      return run(1, pageSize);
    },
    [run, pageSize],
  );

  /** 清空条件；immediate 页重新查询，非 immediate 页回到未查询状态 */
  const reset = useCallback(() => {
    queryRef.current = (initialQuery ?? {}) as Q;
    if (immediate) return run(1, pageSize);
    setData([]);
    setTotal(0);
    setPage(1);
    setQueried(false);
  }, [immediate, initialQuery, run, pageSize]);

  const reload = useCallback(() => run(page, pageSize), [run, page, pageSize]);

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total,
    onChange: (p, size) => run(size !== pageSize ? 1 : p, size),
  };

  return {
    tableProps: { dataSource: data, loading, pagination },
    data,
    total,
    queried,
    query: queryRef.current,
    search,
    reset,
    reload,
  };
}
