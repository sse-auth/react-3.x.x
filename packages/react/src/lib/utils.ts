import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

/**
 * Clone React element.
 * The function clones React element and adds Tailwind CSS classnames to the cloned element
 * @param element the React element to clone
 * @param classNames Tailwind CSS classnames
 * @returns { React.ReactElement } - Cloned React element
 */
export function cloneElement(element: React.ReactElement, classNames: string) {
  return React.cloneElement(element, {
    // @ts-ignore
    className: twMerge(element.props.className, classNames),
  });
}

export function getColumnCount({
  length,
  max,
}: Record<"length" | "max", number>): number {
  const numRows = Math.ceil(length / max);
  return Math.ceil(length / numRows);
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
