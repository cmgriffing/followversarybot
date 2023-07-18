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
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Textarea
        id={id}
        value={value}
        onInput={(e) => setter && setter(e.currentTarget.value)}
      />
    </div>
  );
}
