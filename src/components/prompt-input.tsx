import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  value: string;
  placeholder?: string;
  className?: string;
  isSubmitting?: boolean;
  classNames?: {
    card?: string;
    content?: string;
    textarea?: string;
  };
  onChange: (value: string) => void;
}

export default function PromptInput({
  value,
  placeholder,
  className,
  classNames = {},
  isSubmitting,
  onChange,
}: PromptInputProps) {
  return (
    <Card className={cn(classNames.card)}>
      <CardContent className={cn("flex flex-col gap-2", classNames.content)}>
        <Textarea
          placeholder={placeholder}
          className={cn("w-full resize-none", className, classNames.textarea)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value.length > 0 && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full align-self-end"
          >
            {isSubmitting ? <Spinner /> : "Send"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
