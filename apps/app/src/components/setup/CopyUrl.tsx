import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

interface CopyUrlProps {
  browserSourceUrl: string;
}

export function CopyUrl({ browserSourceUrl }: CopyUrlProps) {
  const { toast } = useToast();

  return (
    <div className="flex-col w-full max-w-sm gap-2">
      <Label className="mb-2">Copy URL</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="input"
          value={
            browserSourceUrl ||
            "Error: You need to log in and set bot name and channel name."
          }
          readOnly
        />
        <Button
          type="button"
          disabled={!browserSourceUrl}
          onClick={() => {
            console.log("clicked");
            navigator.clipboard.writeText(browserSourceUrl).then(
              () => {
                toast({
                  variant: "default",
                  title: "Copied!",
                  description: "BrowserSource URL copied.",
                });
              },
              () => {
                toast({
                  variant: "destructive",
                  title: "Error!",
                  description: "URL could not be copied.",
                });
              }
            );
          }}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
