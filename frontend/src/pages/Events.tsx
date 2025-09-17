import { EventCard } from "@/components/EventCard";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import events from "@/data/events.json"; // TODO: remove dummy data
import type { Event } from "@/interfaces/event.interface";
import { useState } from "react";

export default function Events() {
  // @ts-ignore
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [searchText, setSearchText] = useState('');

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchText(query);
    setFilteredEvents(
      // @ts-ignore
      searchText.length > 0 ? events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase())
      ) : events
    );
  };

  return (
    <>
      <div className="w-full px-4 mb-4">
        <Input
          type="search"
          placeholder="Search for events..."
          onChange={handleSearchInput}
        />
      </div>
      {filteredEvents.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-6">
        {filteredEvents.map((item, index) => (
          <EventCard key={index} {...item} />
        ))}


      </div>}
      {filteredEvents.length === 0 && <div className="px-4">
        <Alert variant="destructive">
          <AlertTitle>No search results found for "{searchText}"</AlertTitle>
        </Alert>
      </div>}
    </>
  );
}
