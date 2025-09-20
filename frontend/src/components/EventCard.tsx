import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import type { Event } from "@/interfaces/event.interface";
import { ExternalLinkIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface EventCardProps extends Event { }

export function EventCard({ id, title, tagline, startDate, endDate }: EventCardProps) {
    return (
        <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col max-w-sm mx-auto p-4 relative h-[30rem]">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text={title} />

            <h2 className="dark:text-white text-black mt-4 text-sm font-light mb-4">
                {tagline}
            </h2>
            <div className="mb-4">
                {
                    new Date(startDate) > new Date() && (
                        <Badge>Upcoming</Badge>
                    )
                }
                {
                    new Date(endDate) < new Date() && (
                        <Badge>Ended</Badge>
                    )
                }
                {
                    new Date(startDate) <= new Date() && new Date(endDate) >= new Date() && (
                        <div className="flex items-center justify-between">
                            <Badge><span className="p-1 rounded-full bg-red-500 animate-ping"></span> &nbsp; Active</Badge>
                            <Link to={"/events/" + id} className={buttonVariants({ size: "sm", })}>
                                <ExternalLinkIcon /> Browse Details
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
