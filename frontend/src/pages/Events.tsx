import { EventCard } from "@/components/EventCard";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import type { Event } from "@/interfaces/event.interface";
import { useState, useEffect, type JSX } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { Loader2Icon } from "lucide-react";

export default function Events() {
  const [loading, setLoading] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    axios
      .get<Event[]>(`${BACKEND_URL}/event`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data ?? [];
        const normalized = data.map((ev: any) => ({
          ...ev,
          title: ev.title ?? ev.name,
        })) as Event[];
        setAllEvents(normalized);
        setFilteredEvents(normalized);
      })
      .catch(() => {
        // if backend not available, leave arrays empty
      })
      .finally(() => {
        if (mounted) setLoading(false);
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
        ? allEvents.filter(
            (event) =>
              // backend normalizes to title
              event.title?.toLowerCase().includes(query.toLowerCase())
          )
        : allEvents
    );
  };

  return (
    <>
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="flex items-center gap-4">
            <Loader2Icon className="animate-spin" /> Loading...
          </p>
        </div>
      )}

      {!loading && (
        <>
          <div className="w-full px-4 mb-4">
            <Input
              type="search"
              placeholder="Search for events..."
              onChange={handleSearchInput}
            />
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((item, index) => (
                <EventCard key={index} {...item} />
              ))}
            </div>
          ) : (
            <div className="px-4">
              <Alert variant="destructive">
                <AlertTitle>
                  No search results found for "{searchText}"
                </AlertTitle>
              </Alert>
            </div>
          )}
        </>
      )}
    </>
  );
}
