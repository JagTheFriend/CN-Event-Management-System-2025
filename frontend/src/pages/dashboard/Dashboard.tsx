import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Event } from "@/interfaces/event.interface";
import type { ColumnDef } from "@tanstack/react-table";
import events from "@/data/events.json"; // TODO: remove dummy data
import { Button, buttonVariants } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";

const columns: ColumnDef<Event>[] = [
    {
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "users",
        header: "Users",
        cell: ({ row }) => {
            // @ts-ignore
            const totalUsers = row.getValue("users") ? Array.from(row.getValue("users")).length : 0
            return totalUsers
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = row.getValue("id");
            return (
                <div className="flex items-center gap-2">
                    <Link to={`/dashboad/edit/${id}`} className={buttonVariants()}><PencilIcon /></Link>
                    <Button className="cursor-pointer" variant="destructive"><Trash2Icon /></Button>
                </div>
            )
        }
    }
]

export default function Dashboard() {
    // Replace with actual data
    const es = events.map((data) => {
        return {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            updatedAt: new Date(data.updatedAt),
            createdAt: new Date(data.createdAt),
            users: data.users.map((d) => {
                return {
                    ...d,
                    updatedAt: new Date(d.updatedAt),
                    createdAt: new Date(d.createdAt),
                }
            })
        }
    });
    
    return (
        <div className="conatainer px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Card>
                    <CardContent>
                        <CardTitle className="text-lg md:text-xl text-center">Active Events</CardTitle>
                        <p className="text-center">2</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle className="text-lg md:text-xl text-center">Past Events</CardTitle>
                        <p className="text-center">3</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardTitle className="text-lg md:text-xl text-center">Total Events</CardTitle>
                        <p className="text-center">10</p>
                    </CardContent>
                </Card>
            </div>

            <hr className="my-3" />

            <div className="mb-4">
                <DataTable columns={columns} data={es} />
            </div>
        </div>
    )
}