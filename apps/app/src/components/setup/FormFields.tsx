import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import infoSquareRounded from "@iconify/icons-tabler/info-square-rounded";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormInputProps {
  label: string;
  value: string;
  id: string;
  setter?: (newValue: string) => void;
  disabled?: boolean;
  tooltipText?: string;
}

export function FormInput({
  label,
  value,
  setter,
  id,
  disabled,
  tooltipText,
}: FormInputProps) {
  return (
    <div className="flex flex-col w-full max-w-sm justify-center gap-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <Label htmlFor={id}>{label}</Label>

          {!!tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="px-2 py-0">
                    <Icon icon={infoSquareRounded} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[300px]">{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <Input
        id={id}
        type="input"
        value={value}
        onInput={(e) => setter && setter(e.currentTarget.value)}
        disabled={disabled || false}
      />
    </div>
  );
}

export function FormTextArea({
  label,
  value,
  id,
  setter,
  tooltipText,
}: FormInputProps) {
  return (
    <div className="flex flex-col w-full max-w-sm justify-center gap-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <Label htmlFor={id}>{label}</Label>

          {!!tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="px-2 py-0">
                    <Icon icon={infoSquareRounded} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[300px]">{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button>Legend</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px]">
              Available values:
              <ul className="flex flex-col gap-2">
                <li className="flex flex-row gap-2">
                  <div className="font-bold w-[150px] min-w-[150px]">
                    {"{{viewerName}}"}
                  </div>
                  <div>This is the name of the chatter.</div>
                </li>

                <li className="flex flex-row gap-4">
                  <div className="font-bold w-[150px] min-w-[150px]">
                    {"{{yearCount}}"}
                  </div>
                  <div>The amount of years a viewer has been following.</div>
                </li>

                <li className="flex flex-row gap-2">
                  <div className="font-bold w-[150px] min-w-[150px]">
                    {"{{yearLabel}}"}
                  </div>
                  <div>
                    The plural or singular version of the viewer's follow time.
                  </div>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Textarea
        id={id}
        value={value}
        onInput={(e) => setter && setter(e.currentTarget.value)}
      />
    </div>
  );
}
