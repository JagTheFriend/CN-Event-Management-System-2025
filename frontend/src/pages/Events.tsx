import { EventCard } from "@/components/EventCard";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
// removed dummy data import
import type { Event } from "@/interfaces/event.interface";
import { useState, useEffect, type JSX } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let mounted = true;

    axios
      .get<Event[]>(`${BACKEND_URL}/event`)
      .then((res) => {
        if (!mounted) return;
        // backend currently returns an array of events directly
        const data = res.data ?? [];
        // normalize name -> title if backend uses `name`
        const normalized = data.map((ev: any) => ({
          ...ev,
          title: ev.title ?? ev.name,
        })) as Event[];
        setAllEvents(normalized);
        setFilteredEvents(normalized);
      })
      .catch(() => {
        // leave arrays empty if backend not available
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchText(query);
    setFilteredEvents(
      query.length > 0
        ? allEvents.filter((event) =>
            // some dummy events use `title`, others may use `name` — keep title for now
            // @ts-ignore
            event.title.toLowerCase().includes(query.toLowerCase())
          )
        : allEvents
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
      {filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-6">
          {filteredEvents.map((item, index) => (
            <EventCard key={index} {...item} />
          ))}
        </div>
      )}
      {filteredEvents.length === 0 && (
        <div className="px-4">
          <Alert variant="destructive">
            <AlertTitle>No search results found for "{searchText}"</AlertTitle>
          </Alert>
        </div>
      )}
    </>
  );
}
