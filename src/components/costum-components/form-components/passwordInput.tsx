"use client";
import * as React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentPropsWithoutRef<typeof Input> & {
  minLength?: number;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, minLength = 6, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <>
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          minLength={minLength}
          autoComplete={props.autoComplete ?? "current-password"}
          className={cn("h-11 rounded-lg pl-9 pr-10", className)}
          placeholder={props.placeholder ?? "at least 6 characters"}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 my-1 grid place-items-center rounded-md px-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
