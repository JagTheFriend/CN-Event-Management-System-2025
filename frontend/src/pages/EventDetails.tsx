import { useParams } from "react-router-dom";
import events from "@/data/events.json";
import type { Event } from "@/interfaces/event.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users2Icon } from "lucide-react";
import CommentBox from "@/components/CommentBox";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function EventDetails() {
  const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
  const { id } = useParams();
  // @ts-ignore
  const event: Event = events.filter(e => e.id === id)[0];

  const getContent = (content: string) => content;

  const toggleShowMore = (index: number) => {
    setShowMoreIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="px-4">
      <h1 className="md:text-4xl text-xl font-bold mb-3">{event.title}</h1>

      <p className="text-muted-foreground">
        Start Date: {new Date(event.startDate).toDateString()}&nbsp;&bull;&nbsp;End Date:{" "}
        {new Date(event.endDate).toDateString()}
      </p>

      <hr className="my-3" />

      <div className="prose dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: getContent(event.description) }}></div>
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
        {new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date() && (
          <Button className="cursor-pointer">
            <Users2Icon /> Participate
          </Button>
        )}
      </div>

      <hr className="my-3" />

      {/* Enrolled users */}
      <div>
        <h3 className="text-lg font-bold mb-4">Participants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["", "", "", "", "", ""].map((_, index) => (
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
          {["", "", "", "", "", ""].map((_, index) => {
            const isExpanded = showMoreIndex === index;
            return (
              <Card key={index}>
                <CardContent className="space-y-2">
                  <CardTitle>John Doe</CardTitle>
                  <p
                    className={`text-sm ${!isExpanded && "whitespace-nowrap overflow-hidden text-ellipsis max-w-3xl"
                      }`}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel fugit,
                    nostrum quia corrupti aliquam unde et iusto aliquid adipisci quam tenetur
                    cupiditate! Possimus fugiat cum doloribus esse illo suscipit earum.

                  </p>

                  {!isExpanded
                    ? (
                      <Badge className="cursor-pointer" onClick={() => toggleShowMore(index)}>Read More</Badge>
                    )
                    : (
                      <Badge className="cursor-pointer" onClick={() => toggleShowMore(index)}>Show Less</Badge>
                    )
                    }
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
