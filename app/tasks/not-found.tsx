import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export default function TaskNotFound() {
  return (
    <div className="p-8 min-h-[60vh] flex items-center justify-center">
      <Card className="p-8 max-w-md text-center border-0">
        <h1 className="text-3xl font-bold mb-2">Task Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The task you're looking for doesn't exist or has been deleted.
        </p>

        <div className="flex gap-2">
          <Link href={ROUTES.TASKS.ROOT} className="flex-1">
            <Button className="w-full">View All Tasks</Button>
          </Link>
          <Link href={ROUTES.TASKS.NEW} className="flex-1">
            <Button variant="outline" className="w-full">
              Create New
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
