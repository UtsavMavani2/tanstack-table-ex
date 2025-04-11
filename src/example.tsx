import React, { useEffect, useMemo, useState } from 'react'
import axios from "axios";
import Table, { Show } from './Table';
import { createColumnHelper } from '@tanstack/react-table';

//extra code removed for brevity
type GenreProps = {
    genres: string[];
};

const Genres = ({ genres }: GenreProps) => {
    // Loop through the array and create a badge-like component instead of a comma-separated string
    return (
        <>
            {genres.map((genre, idx) => {
                return (
                    <span
                        key={idx}
                        style={{
                            backgroundColor: "green",
                            marginRight: 4,
                            padding: 3,
                            borderRadius: 5,
                        }}
                    >
                        {genre}
                    </span>
                );
            })}
        </>
    );
};

//this function will convert runtime(minutes) into hours and minutes
function convertToHoursAndMinutes(runtime: number) {
    const hour = Math.floor(runtime / 60);
    const min = Math.floor(runtime % 60);
    return `${hour} hour(s) and ${min} minute(s)`;
}

const Example = () => {
    const [data, setData] = useState<Show[]>();
    const columnHelper = createColumnHelper<Show>();
    //define our table headers and data
    const columns = useMemo(
        () => [
            //create a header group:
            columnHelper.group({
                id: "tv_show",
                header: () => <span>TV Show</span>,
                //now define all columns within this group
                columns: [
                    columnHelper.accessor("show.name", {
                        header: "Name",
                        cell: (info) => info.getValue(),
                    }),
                    columnHelper.accessor("show.type", {
                        header: "Type",
                        cell: (info) => info.getValue(),
                    }),
                ],
            }),
            //create another group:
            columnHelper.group({
                id: "details",
                header: () => <span> Details</span>,
                columns: [
                    columnHelper.accessor("show.language", {
                        header: "Language",
                        cell: (info) => info.getValue(),
                    }),
                    columnHelper.accessor("show.genres", {
                        header: "Genres",
                        // cell: (info) => info.getValue(),
                        cell: (info) => <Genres genres={info.getValue()} />,
                    }),
                    columnHelper.accessor("show.runtime", {
                        header: "Runtime",
                        // cell: (info) => info.getValue(),
                        //use our convertToHoursAndMinutes function to render the runtime of the show
                        cell: (info) => convertToHoursAndMinutes(info.getValue()),
                    }),
                    columnHelper.accessor("show.status", {
                        header: "Status",
                        cell: (info) => info.getValue(),
                    }),
                ],
            }),
        ],
        [],
    );
    const fetchData = async () => {
        const result = await axios("https://api.tvmaze.com/search/shows?q=snow");
        setData(result.data);
    };
    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            {data && <Table columns={columns} data={data} />}
        </div>
    )
}

export default Example
