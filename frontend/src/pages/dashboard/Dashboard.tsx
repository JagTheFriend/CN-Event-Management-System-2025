import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import eventsFallback from "@/data/events.json";
import type { Event } from "@/interfaces/event.interface";
import { BACKEND_URL } from "@/lib/config";

const columns: ColumnDef<Event>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "users",
		header: "Users",
		cell: ({ row }) => {
			const usersVal = row.getValue("users") as unknown;
			const totalUsers = Array.isArray(usersVal) ? usersVal.length : 0;
			return totalUsers;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id");
			return (
				<div className="flex items-center gap-2">
					<Link to={`/dashboard/edit/${id}`} className={buttonVariants()}>
						<PencilIcon />
					</Link>
					<Button
						className="cursor-pointer"
						variant="destructive"
						onClick={() => {
							if (
								window.confirm("Are you sure you want to delete this event?")
							) {
								// Call backend delete API (correct route)
								axios
									.delete(`${BACKEND_URL}/event/delete/${id}`)
									.then(() => window.location.reload())
									.catch(() => alert("Failed to delete event"));
							}
						}}
					>
						<Trash2Icon />
					</Button>
				</div>
			);
		},
	},
];

export default function Dashboard() {
	const [es, setEs] = useState<Event[]>([]);

	useEffect(() => {
		let mounted = true;
		axios
			.get<{ success: boolean; data: Event[] }>(
				`${BACKEND_URL}/user/enrolled-events`,
				{ withCredentials: true },
			)
			.then((res) => {
				if (!mounted) return;
				const data = res.data?.data ?? [];
				const normalized = data.map((d: any) => ({
					...d,
					title: "TEST DATA" + (d.title ?? d.name),
					startDate: new Date(d.startDate),
					endDate: new Date(d.endDate),
					updatedAt: new Date(d.updatedAt),
					createdAt: new Date(d.createdAt),
					users: (d.users ?? []).map((u: any) => ({
						...u,
						updatedAt: new Date(u.updatedAt),
						createdAt: new Date(u.createdAt),
					})),
				})) as Event[];
				setEs(normalized);
			})
			.catch(() => {
				// on failure use local fallback data for offline / dev
				const normalized = (eventsFallback as any[]).map((d: any) => ({
					...d,
					title: d.title ?? d.name,
					startDate: new Date(d.startDate),
					endDate: new Date(d.endDate),
					updatedAt: new Date(d.updatedAt),
					createdAt: new Date(d.createdAt),
					users: (d.users ?? []).map((u: any) => ({
						...u,
						updatedAt: new Date(u.updatedAt),
						createdAt: new Date(u.createdAt),
					})),
				})) as Event[];
				setEs(normalized);
			});

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="conatainer px-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				<Card>
					<CardContent>
						<CardTitle className="text-lg md:text-xl text-center">
							Active Events
						</CardTitle>
						<p className="text-center">2</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<CardTitle className="text-lg md:text-xl text-center">
							Past Events
						</CardTitle>
						<p className="text-center">3</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<CardTitle className="text-lg md:text-xl text-center">
							Total Events
						</CardTitle>
						<p className="text-center">10</p>
					</CardContent>
				</Card>
			</div>

			<hr className="my-3" />

			<div className="mb-4">
				<DataTable columns={columns} data={es} />
			</div>
		</div>
	);
}
