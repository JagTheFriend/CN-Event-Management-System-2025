import { EventCard } from "@/components/EventCard";
import events from "@/data/events.json"; // TODO: remove dummy data

export default function Events() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-6">
      {
        events.map((item, index) => (
          <EventCard key={index} {...item} />
        ))
      }
    </div>
  )
}
