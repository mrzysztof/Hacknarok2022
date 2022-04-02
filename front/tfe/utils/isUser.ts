import { User } from "../context";

/**
 * Check if given object is a User object.
 */
export const isUser = (object: any): object is User => {
  return (
    typeof object !== "boolean" &&
    object.id !== undefined &&
    object.email !== undefined
  );
};
