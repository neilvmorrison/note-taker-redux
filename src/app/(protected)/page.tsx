"use client";
import { Text } from "@/components/ui/text";
import { useRecentActivity } from "@/hooks/use-recent-activity";
import PromptInput from "@/components/prompt-input";
import Icon from "@/components/ui/icons";
import { ResourceCard } from "@/components/resource-card";

export default function Page() {
  const { data } = useRecentActivity();

  return (
    <div className="mt-8 md:mt-12 flex flex-col items-center justify-center px-4 md:px-0 gap-16">
      <div className="w-full max-w-[480px] text-center flex flex-col gap-3">
        <Text variant="h2" className="text-2xl md:text-3xl">
          {"Let's get started"}
        </Text>
        <PromptInput
          value=""
          placeholder="Type your request here..."
          currentModel=""
          onModelChange={() => {}}
          onChange={() => {}}
        />
      </div>
      <div className="self-start lg:ml-18 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon name="recent_activity" />
          <Text variant="h3">Recent Activity</Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.combinedActivity?.combinedActivity?.map((activity) => (
            <ResourceCard
              key={activity.id}
              title={activity.title ?? ""}
              description={activity.summary ?? ""}
              type={activity.summary ? "chat" : "note"}
              timestamp={
                (activity.lastViewedAt || activity.createdAt) ?? undefined
              }
              href={activity.url ?? ""}
              className="w-[320px] md:min-w-[240px] lg:min-w-[300px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
