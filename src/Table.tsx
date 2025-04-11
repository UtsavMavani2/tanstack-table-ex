import { useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    GroupColumnDef,
    useReactTable,
} from "@tanstack/react-table";

type TableProps<TData> = {
    data: TData[];
    columns: GroupColumnDef<TData>[];
};

export type Show = {
    show: {
        status: string;
        name: string;
        type: string;
        language: string;
        genres: string[];
        runtime: number;
    };
};


function Searchbar({
    value: initialValue,
    onChange,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    //if the entered value changes, run the onChange handler once again.
    useEffect(() => {
        onChange(value);
    }, [value]);
    //render the basic searchbar:
    return (
        <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export default function Table({ columns, data, }: TableProps<Show>) {
    const [globalFilter, setGlobalFilter] = useState("");

    //use the useReact table Hook to build our table:
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {},
        state: {
            globalFilter, //specify our global filter here
        },
        onGlobalFilterChange: setGlobalFilter, //if the filter changes, change the hook value
        globalFilterFn: "includesString", //type of filtering
        getFilteredRowModel: getFilteredRowModel(), //row model to filter the table
        getPaginationRowModel: getPaginationRowModel(), // enable client-side pagination
    });
    // Table component logic and UI come here
    return (
        <div>
            <Searchbar
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(String(value))}
                placeholder="Search all columns..."
            />
            <table border={1} cellPadding={10} cellSpacing={0}>
                <thead>
                    {/*use the getHeaderGRoup function to render headers:*/}
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {/*Now render the cells*/}
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* pagination */}
            <div>
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    {'<<'}
                </button>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {'<'}
                </button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {'>'}
                </button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    {'>>'}
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
            </div>
        </div>
    );
}