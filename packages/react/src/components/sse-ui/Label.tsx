import * as LabelPrimitive from "../radix-ui/Label";
import React from "react";
import { form, type LabelProps } from "@sse-ui/themer";

export interface FormLabelProps
  extends Omit<LabelProps, "asTextarea" | "floating" | "variant"> {
  className?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & FormLabelProps
>(({ className, size = "md", ...props }, forwardedRef) => {
  const { label } = form();

  return (
    <LabelPrimitive.Root
      ref={forwardedRef}
      className={label({ size, className })}
      {...props}
    />
  );
});

export default Label;
