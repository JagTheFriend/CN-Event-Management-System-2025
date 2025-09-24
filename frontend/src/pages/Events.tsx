import { EventCard } from "@/components/EventCard";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import events from "@/data/events.json"; // TODO: remove dummy data
import type { Event } from "@/interfaces/event.interface";
import { useState, type JSX } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export default async function Events() {
  // @ts-ignore
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchText(query);
    setFilteredEvents(
      // @ts-ignore
      searchText.length > 0
        ? events.filter((event) =>
            event.title.toLowerCase().includes(query.toLowerCase())
          )
        : events
    );
  };

  type EventsApiResponse = {
    success: boolean;
    data: Event[];
    length: number;
    map: (
      arg0: (item: Event, index: number) => JSX.Element
    ) => import("react").ReactNode;
  };

  const { data: AllEvents } = await axios.get<EventsApiResponse>(
    `${BACKEND_URL}/event`
  );
  if (AllEvents.success) {
    setFilteredEvents(AllEvents.data);
  }

  return (
    <>
      <div className="w-full px-4 mb-4">
        <Input
          type="search"
          placeholder="Search for events..."
          onChange={handleSearchInput}
        />
      </div>
      {AllEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-6">
          {AllEvents.map((item, index) => (
            <EventCard key={index} {...item} />
          ))}
        </div>
      )}
      {AllEvents.length === 0 && (
        <div className="px-4">
          <Alert variant="destructive">
            <AlertTitle>No search results found for "{searchText}"</AlertTitle>
          </Alert>
        </div>
      )}
    </>
  );
}
