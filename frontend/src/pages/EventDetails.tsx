import axios from "axios";
import { Loader2Icon, Users2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentBox from "@/components/CommentBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Event } from "@/interfaces/event.interface";
import { BACKEND_URL } from "@/lib/config";

export default function EventDetails() {
  const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleShowMore = (index: number) => {
    setShowMoreIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    let mounted = true;

    axios
      .get(`${BACKEND_URL}/event/${id}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        if (data) {
          const normalized = { ...data, title: data.title ?? data.name };
          setEvent(normalized as Event);
        } else {
          setEvent(null);
        }
      })
      .catch((err) => {
        setError(err?.response?.data || err.message || "Failed to load event");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="flex items-center gap-4">
          <Loader2Icon className="animate-spin" /> Loading...
        </p>
      </div>
    );

  if (error) return <div className="px-4 text-red-500">Error: {error}</div>;
  if (!event) return <div className="px-4">Event not found</div>;

  return (
    <div className="px-4">
      <h1 className="md:text-4xl text-xl font-bold mb-3">{event.title}</h1>

      <p className="text-muted-foreground">
        Start Date: {new Date(event.startDate).toDateString()}
        &nbsp;&bull;&nbsp;End Date: {new Date(event.endDate).toDateString()}
      </p>

      <hr className="my-3" />

      <div className="prose dark:prose-invert mb-4">
        <div dangerouslySetInnerHTML={{ __html: event.description }}></div>
      </div>

      <div className="mb-4">
        {new Date(event.startDate) > new Date() && (
          <p className="text-muted-foreground">
            To be held on {new Date(event.startDate).toDateString()}
          </p>
        )}
        {new Date(event.endDate) < new Date() && (
          <p className="text-muted-foreground">Event has ended</p>
        )}
        {new Date(event.startDate) <= new Date() &&
          new Date(event.endDate) >= new Date() && (
            <Button className="cursor-pointer">
              <Users2Icon /> Participate
            </Button>
          )}
      </div>

      <hr className="my-3" />

      {/* Organizer */}
      <div className="max-w-fit flex flex-rw gap-2">
        <h3 className="font-medium mb-2">Organized by</h3>
        <p className="font-normal">
          {(event as any).user?.username ?? "Unknown"}
        </p>
      </div>

      <hr className="my-3" />

      <CommentBox
        eventId={event.id}
        onSuccess={(c: any) => {
          setEvent((prev) => ({
            ...(prev as Event),
            comments: [...(prev?.comments ?? []), c],
          }));
        }}
      />

      {/* Comments */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-4">
          Comments ({event.comments?.length ?? 0})
        </h3>
        {!event.comments || event.comments.length === 0 ? (
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="flex flex-col space-y-3">
            {event.comments.map((c, index) => {
              const isExpanded = showMoreIndex === index;
              const commentText = (c as any).content || "";
              const shouldShowToggle = commentText.length > 150;

              return (
                <Card key={c.id}>
                  <CardContent className="space-y-2 pt-4">
                    <div className="flex items-center gap-2">
                      {(c as any).user?.imageUrl && (
                        <img
                          src={(c as any).user.imageUrl}
                          alt={(c as any).user?.name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <CardTitle className="text-base">
                        {(c as any).user?.name ||
                          (c as any).user?.email ||
                          "Anonymous"}
                      </CardTitle>
                    </div>
                    <p
                      className={`text-sm text-muted-foreground ${
                        !isExpanded && shouldShowToggle ? "line-clamp-3" : ""
                      }`}
                    >
                      {commentText}
                    </p>

                    {shouldShowToggle && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => toggleShowMore(index)}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
