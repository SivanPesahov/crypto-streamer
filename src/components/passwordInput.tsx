"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { ControllerRenderProps } from "react-hook-form";

type RegisterFormValues = {
  email: string;
  password: string;
  name?: string;
};

type Props = {
  field: ControllerRenderProps<RegisterFormValues, "password">;
};

function PasswordInput({ field }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {" "}
      <Input
        type={showPassword ? "text" : "password"}
        minLength={6}
        autoComplete="current-password"
        className="h-11 rounded-lg pl-9 pr-10"
        {...field}
        placeholder="at least 6 characters"
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

export default PasswordInput;
