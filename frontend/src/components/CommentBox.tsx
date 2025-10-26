"use client";

import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BACKEND_URL } from "@/lib/config";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

const commentSchema = z.object({
	content: z
		.string({ error: "Comment cannot be empty" })
		.min(10, { error: "Comment must contain atlease 10 characters" }),
});

type CommentBoxProps = {
	eventId: string;
	onSuccess?: (comment: any) => void;
};

export default function CommentBox({ eventId, onSuccess }: CommentBoxProps) {
	const { isSignedIn } = useUser();

	const form = useForm<z.infer<typeof commentSchema>>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof commentSchema>) => {
		try {
			const res = await axios.post(`${BACKEND_URL}/comment/new`, {
				...data,
				eventId,
				userId: "anonymous",
			});
			const created = res.data;
			form.reset();
			onSuccess?.(created);
		} catch (err: any) {
			console.error("Failed to post comment", err);
		}
	};

	if (!isSignedIn) {
		return <p>Please sign in to post a comment.</p>;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Comment</FormLabel>
							<FormControl>
								<Textarea placeholder="Enter your comment..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className="cursor-pointer">Submit</Button>
			</form>
		</Form>
	);
}
