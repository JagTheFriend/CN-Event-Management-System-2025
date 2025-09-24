import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Event } from "@/interfaces/event.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users2Icon } from "lucide-react";
import CommentBox from "@/components/CommentBox";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";

export default function EventDetails() {
  const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getContent = (content: string) => content;

  const toggleShowMore = (index: number) => {
    setShowMoreIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${BACKEND_URL}/event/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        // normalize backend 'name' -> frontend 'title' if necessary
        if (data) {
          const normalized = { ...data, title: data.title ?? data.name };
          setEvent(normalized as Event);
        } else {
          setEvent(null);
        }
      })
      .catch((err) => setError(err.message || "Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="px-4">Loading...</div>;
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

      <div className="prose dark:prose-invert">
        <div
          dangerouslySetInnerHTML={{ __html: getContent(event.description) }}
        ></div>
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

      {/* Enrolled users - render if event.users exists, otherwise show placeholder */}
      <div>
        <h3 className="text-lg font-bold mb-4">Participants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {event.users && event.users.length > 0
            ? event.users.map((u) => (
                <Card key={u.id}>
                  <CardContent>
                    <p>{u.username}</p>
                  </CardContent>
                </Card>
              ))
            : ["", "", "", "", "", ""].map((_, index) => (
                <Card key={index}>
                  <CardContent>
                    <p>John Doe</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      <hr className="my-3" />

      <CommentBox />

      {/* Comments */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-4">Comments</h3>
        <div className="flex flex-col space-y-3">
          {(event.comments ?? []).map((c, index) => {
            const isExpanded = showMoreIndex === index;
            return (
              <Card key={c.id}>
                <CardContent className="space-y-2">
                  <CardTitle>
                    {(c as any).user?.username ??
                      (c as any).userId ??
                      "Anonymous"}
                  </CardTitle>
                  <p
                    className={`text-sm ${
                      !isExpanded &&
                      "whitespace-nowrap overflow-hidden text-ellipsis max-w-3xl"
                    }`}
                  >
                    {(c as any).content}
                  </p>

                  {!isExpanded ? (
                    <Badge
                      className="cursor-pointer"
                      onClick={() => toggleShowMore(index)}
                    >
                      Read More
                    </Badge>
                  ) : (
                    <Badge
                      className="cursor-pointer"
                      onClick={() => toggleShowMore(index)}
                    >
                      Show Less
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
