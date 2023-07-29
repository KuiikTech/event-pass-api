export class Paginated<T> {
  readonly count: number;
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

export interface FilterToFindWithSearchRegex {
  $or: Array<{
    [field: string]: { $regex: string; $options: string };
  }>;
}

export interface SearchFilters {
  [name: string]: unknown;
}

export class FilterToFindFactory {
  static createFilterWithSearch(
    searchFilters: SearchFilters,
  ): FilterToFindWithSearchRegex {
    const orArray = Object.entries(searchFilters).map(
      ([fieldName, searchValue]) => ({
        [fieldName]: {
          $regex: `${searchValue}`,
          $options: 'i',
        },
      }),
    );

    return {
      $or: orArray,
    };
  }
}
