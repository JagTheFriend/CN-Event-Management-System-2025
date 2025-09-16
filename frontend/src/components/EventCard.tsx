import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";

interface EventCardProps {
    id: string
    title: string,
    description: string,
    startDate: string,
    endDate: string
}

export function EventCard({ id, title, description }: EventCardProps) {
    return (
        <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text={title} />

            <h2 className="dark:text-white text-black mt-4 text-sm font-light mb-4">
                {description}
            </h2>
            <Link to={"/event/" + id} className={buttonVariants()}>
                Enroll &raquo;
            </Link>
        </div>
    );
}
