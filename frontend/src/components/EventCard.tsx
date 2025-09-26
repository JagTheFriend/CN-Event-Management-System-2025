import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import type { Event } from "@/interfaces/event.interface";
import { ExternalLinkIcon, Users, Calendar, UserPlus, UserMinus } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EventCardProps extends Event {
  enrollmentCount?: number;
  maxCapacity?: number;
}

export function EventCard({ 
  id, 
  title, 
  tagline, 
  startDate, 
  endDate, 
  enrollmentCount = 0, 
  maxCapacity 
}: EventCardProps) {
    const { isSignedIn, userId } = useAuth();
    const api = useApi();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEnrollmentCount, setCurrentEnrollmentCount] = useState(enrollmentCount);

    useEffect(() => {
        if (isSignedIn && userId) {
            checkEnrollmentStatus();
        }
    }, [isSignedIn, userId, id]);

    const checkEnrollmentStatus = async () => {
        try {
            const response = await api.getEnrollmentStatus(id);
            setIsEnrolled(response.data.isEnrolled);
        } catch (error) {
            console.error('Failed to check enrollment status:', error);
        }
    };

    const handleEnrollment = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to enroll in events");
            return;
        }

        setIsLoading(true);
        try {
            if (isEnrolled) {
                await api.unenrollFromEvent(id);
                setIsEnrolled(false);
                setCurrentEnrollmentCount(prev => prev - 1);
                toast.success("Successfully unenrolled from event");
            } else {
                if (maxCapacity && currentEnrollmentCount >= maxCapacity) {
                    toast.error("Event is at full capacity");
                    return;
                }
                await api.enrollInEvent(id);
                setIsEnrolled(true);
                setCurrentEnrollmentCount(prev => prev + 1);
                toast.success("Successfully enrolled in event");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update enrollment");
        } finally {
            setIsLoading(false);
        }
    };

    const isEventActive = new Date(startDate) <= new Date() && new Date(endDate) >= new Date();
    const isEventUpcoming = new Date(startDate) > new Date();
    const isEventEnded = new Date(endDate) < new Date();
    const isEventFull = maxCapacity ? currentEnrollmentCount >= maxCapacity : false;

    return (
        <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col max-w-sm mx-auto p-4 relative h-[35rem]">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text={title} />

            <h2 className="dark:text-white text-black mt-4 text-sm font-light mb-4">
                {tagline}
            </h2>
            
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{currentEnrollmentCount} enrolled</span>
                {maxCapacity && (
                    <>
                        <span>/</span>
                        <span>{maxCapacity} max</span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(startDate).toLocaleDateString()}</span>
            </div>

            <div className="mb-4 flex-1">
                {isEventUpcoming && (
                    <Badge variant="secondary">Upcoming</Badge>
                )}
                {isEventEnded && (
                    <Badge variant="destructive">Ended</Badge>
                )}
                {isEventActive && (
                    <Badge variant="default">
                        <span className="p-1 rounded-full bg-red-500 animate-ping"></span> 
                        &nbsp; Active
                    </Badge>
                )}
                {isEventFull && (
                    <Badge variant="outline" className="ml-2">Full</Badge>
                )}
            </div>

            <div className="space-y-2">
                <Link to={"/events/" + id} className={buttonVariants({ size: "sm", className: "w-full" })}>
                    <ExternalLinkIcon className="mr-2 h-4 w-4" />
                    View Details
                </Link>
                
                {isSignedIn && !isEventEnded && (
                    <Button
                        onClick={handleEnrollment}
                        disabled={isLoading || (!isEnrolled && isEventFull)}
                        variant={isEnrolled ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : isEnrolled ? (
                            <>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Unenroll
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Enroll
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
