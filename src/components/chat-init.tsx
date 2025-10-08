import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";

export default function ChatInit() {
  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-3 md:p-6">
        <Input placeholder="Type your request here..." className="text-base" />
      </CardContent>
      <CardFooter className="p-3 md:p-6 pt-0 md:pt-0">
        <Button className="w-full h-10">Go</Button>
      </CardFooter>
    </Card>
  );
}
