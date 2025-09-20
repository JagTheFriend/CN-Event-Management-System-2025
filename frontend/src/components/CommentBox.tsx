"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const commentSchema = z.object({
    content: z
        .string({ error: "Comment cannot be empty" })
        .min(10, {error: "Comment must contain atlease 10 characters"})
});

export default function CommentBox() {
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: ""
        }
    });

    const onSubmit = (data: z.infer<typeof commentSchema>) => {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
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
    )
}
