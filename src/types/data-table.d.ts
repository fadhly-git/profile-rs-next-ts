export interface StatCard {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    borderColor: string;
}
export interface BaseTableData {
    id: string | number | bigint; // Tambahkan bigint untuk mendukung Prisma
    createdAt: Date | string;
}

export interface TableColumn<T extends BaseTableData> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    hidden?: boolean;
    width?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, row: T) => React.ReactNode;
}

export interface TableStats {
    total: number;
    thisWeek: number;
    thisMonth: number;
    [key: string]: number;
}

export interface DataTableProps<T extends BaseTableData> {
    data: T[];
    columns: TableColumn<T>[];
    title?: string;
    searchPlaceholder?: string;
    onRefresh?: () => void;
    onExport?: (selectedIds: (string | number | bigint)[]) => void;
    onDelete?: (selectedIds: (string | number | bigint)[]) => void;
    onRowClick?: (row: T) => void;
    filters?: TableFilter[];
    stats?: TableStats;
    customActions?: TableAction<T>[];
}

export interface TableFilter {
    key: string;
    label: string;
    type: 'select' | 'date' | 'search';
    options?: { value: string; label: string }[];
    defaultValue?: string;
}

export interface TableAction<T extends BaseTableData> {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: (row: T) => void;
    variant?: 'default' | 'destructive' | 'outline';
    disabled?: (row: T) => boolean;
}