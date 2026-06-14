import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export default function MeetingNotFound() {
  return (
    <div className="p-8 min-h-[60vh] flex items-center justify-center">
      <Card className="p-8 max-w-md text-center border-0">
        <h1 className="text-3xl font-bold mb-2">Meeting Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The meeting you're looking for doesn't exist or has been deleted.
        </p>

        <div className="flex gap-2">
          <Link href={ROUTES.MEETINGS.ROOT} className="flex-1">
            <Button className="w-full">View All Meetings</Button>
          </Link>
          <Link href={ROUTES.MEETINGS.NEW} className="flex-1">
            <Button variant="outline" className="w-full">
              Schedule New
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
