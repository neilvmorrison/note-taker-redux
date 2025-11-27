import { Button } from "./ui/button";
import Icon from "./ui/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { models } from "@/constants/models";

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
  currentModel: string;
  onChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

export default function PromptInput({
  value,
  placeholder,
  className,
  classNames = {},
  isSubmitting,
  onChange: onPromptChange,
  onModelChange,
  currentModel,
}: PromptInputProps) {
  return (
    <Card className={cn(classNames.card)}>
      <CardContent className={cn("flex flex-col gap-6", classNames.content)}>
        <Textarea
          placeholder={placeholder}
          className={cn("w-full resize-none", className, classNames.textarea)}
          value={value}
          onChange={(e) => onPromptChange(e.target.value)}
        />
        <div className="flex justify-between">
          <Select
            onValueChange={(value) => onModelChange(value)}
            value={currentModel}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(models).map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {value.length > 0 && (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="size-fit self-end h-[40px] w-[40px] rounded-full"
            >
              {isSubmitting ? <Spinner /> : <Icon name="send" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
