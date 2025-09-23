import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";

export default function ChatInit() {
  return (
    <Card>
      <CardContent>
        <Input />
      </CardContent>
      <CardFooter>
        <Button className="w-full">Go</Button>
      </CardFooter>
    </Card>
  );
}
