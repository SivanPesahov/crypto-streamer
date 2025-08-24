"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import AuthSpinner from "@/ui/spinners/authSpinner";

type Props = {
  text1: string;
  text2: string;
};
export function FormSubmitButton({ text1, text2 }: Props) {
  const { pending } = useFormStatus();
  pending ? console.log("aaaaa") : null;

  return (
    <Button
      type="submit"
      className="w-full h-11 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
      disabled={pending}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <AuthSpinner />
          {text1}
        </span>
      ) : (
        `${text2}`
      )}
    </Button>
  );
}

export default FormSubmitButton;
