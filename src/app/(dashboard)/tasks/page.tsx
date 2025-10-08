import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Tasks() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        description="A list of all tasks assigned or created to the user"
        right_section={<Button>Create Task</Button>}
      />
    </div>
  );
}
