export type FilterConfig<T> = {
  type: T;
  onChange: (value: string) => void;
  options?: T extends "select" ? { value: string; text: string }[] : never;
  defaultValue?: T extends "input" ? string : never;
};

export type FactoryPreFilterItemProps =
  | {
      type: "input";
      text: string;
      onChange: (value: string) => void;
      defaultValue: string; // Required when type is "input"
      options?: never; // Not allowed when type is "input"
    }
  | {
      type: "select";
      text: string;
      onChange: (value: string) => void;
      options: { value: string; text: string }[]; // Required when type is "select"
      defaultValue?: never; // Not allowed when type is "select"
    };
