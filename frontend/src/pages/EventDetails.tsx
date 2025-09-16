import { useParams } from "react-router-dom";
import events from "@/data/events.json";
import type { Event } from "@/interfaces/event.interface";
import { Button } from "@/components/ui/button";
import { Users2Icon } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const event: Event = events.filter(e => e.id === id)[0];

  const getContent = (content: string) => content;

  return (
    <div className="px-4">
      <h1 className="md:text-4xl text-xl font-bold mb-3">{event.title}</h1>

      <p className="text-muted-foreground">
        Start Date: {new Date(event.startDate).toDateString()}&nbsp;&bull;&nbsp;End Date: {new Date(event.endDate).toDateString()}
      </p>

      <hr className="my-3" />

      <div className="prose dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: getContent(event.description) }}></div>
      </div>

      <div className="mb-4">
        {
          new Date(event.startDate) > new Date() && (
            <p className="text-muted-foreground">
              To be held on {new Date(event.startDate).toDateString()}
            </p>
          )
        }
        {
          new Date(event.endDate) < new Date() && (
            <p className="text-muted-foreground">Event has ended</p>
          )
        }
        {
          new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date() && (
            <Button className="cursor-pointer">
              <Users2Icon /> Participate
            </Button>
          )
        }
      </div>
    </div>
  )
}
