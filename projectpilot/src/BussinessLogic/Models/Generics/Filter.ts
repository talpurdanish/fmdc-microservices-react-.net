export interface Filter {
    term: string;
    searchfield: number;
    sortfield: string;
    order: number;
    id: number;
    page: number;
    pageSize: number;
    pageLess: boolean;
}

export function convertFilter(filter: Filter): Record<string, string> {
    if (!filter) return {};
    return {
        term: filter.term ?? "",
        searchfield: String(filter.searchfield),
        sortfield: String(filter.sortfield),
        order: String(filter.order),
        id: String(filter.id),
        page: String(filter.page),
        pageSize: String(filter.pageSize),
        pageLess: String(filter.pageLess)
    };
}

export default function createDefaultFilter(): Filter {

    return {
        term: '',
        searchfield: 1,
        sortfield: "1",
        order: 1,
        id: -1,
        page: 1,
        pageSize: 5,
        pageLess: false
    }

}
