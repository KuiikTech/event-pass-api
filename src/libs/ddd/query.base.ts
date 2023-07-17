export const OrderByOptions = [
  'asc',
  'desc',
  'ascending',
  'descending',
  1,
  -1,
] as const;

export interface OrderBy {
  [field: string]: (typeof OrderByOptions)[number];
}

export type PaginatedQueryParams = {
  limit: number;
  page: number;
  offset: number;
  orderBy: OrderBy;
};

export abstract class PaginatedQueryBase {
  limit: number;
  offset: number;
  orderBy: OrderBy;
  page: number;

  constructor(props: PaginatedParams<PaginatedQueryBase>) {
    this.limit = props.limit || 20;
    this.offset = props.page ? props.page * this.limit : 0;
    this.page = props.page || 0;
    this.orderBy = props.orderBy || { createdAt: 'asc' };
  }
}

// Parámetros de consulta paginados
export type PaginatedParams<T> = Omit<
  T,
  'limit' | 'offset' | 'orderBy' | 'page'
> &
  Partial<Omit<PaginatedQueryParams, 'offset'>>;
