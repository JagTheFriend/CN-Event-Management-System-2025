"use client";

import { useAuth, useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
    .string({ message: "Comment cannot be empty" })
    .min(10, { message: "Comment must contain at least 10 characters" }),
});

type CommentBoxProps = {
  eventId: string;
  onSuccess?: (comment: any) => void;
};

export default function CommentBox({ eventId, onSuccess }: CommentBoxProps) {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof commentSchema>) => {
    if (!user?.id) {
      toast.error("Please sign in to post a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get Clerk session token (without template - uses default session token)
      const token = await getToken();

      console.log("--- Frontend Debug ---");
      console.log("User ID:", user.id);
      console.log("Token present:", !!token);
      console.log(
        "Token preview:",
        token ? token.substring(0, 30) + "..." : "null"
      );
      console.log("Backend URL:", BACKEND_URL);

      if (!token) {
        console.error("No token received from Clerk");
        toast.error("Authentication failed. Please sign in again.");
        setIsSubmitting(false);
        return;
      }

      // Post comment with auth token
      const res = await axios.post(
        `${BACKEND_URL}/comment/new`,
        {
          content: data.content,
          eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", res.data);

      // Backend returns { success: true, data: comment }
      if (res.data.success && res.data.data) {
        form.reset();
        toast.success("Comment posted successfully!");
        onSuccess?.(res.data.data);
      } else {
        toast.error("Failed to post comment");
      }
    } catch (err: any) {
      console.error("Failed to post comment - Full error:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      console.error("Response headers:", err.response?.headers);

      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to post comment. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">
          Please sign in to post a comment.
        </p>
      </div>
    );
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
                <Textarea
                  placeholder="Enter your comment..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
