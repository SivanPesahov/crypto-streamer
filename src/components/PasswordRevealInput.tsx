"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import LockIcon from "@/ui/icons/lockIcon";

type Props = {
  name?: string;
  minLength?: number;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
};

export default function PasswordRevealInput({
  name = "password",
  minLength = 6,
  autoComplete = "current-password",
  placeholder = "At least 6 characters",
  className,
  id,
  "aria-describedby": ariaDescribedBy,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center">
        <LockIcon />
      </span>

      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`h-11 rounded-lg pl-9 pr-10 ${className ?? ""}`}
        aria-describedby={ariaDescribedBy}
        required
      />

      <button
        type="button"
        className="absolute inset-y-0 right-2 my-1 grid place-items-center rounded-md px-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        title={show ? "Hide password" : "Show password"}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
