// User can simply pass an array of strings or an array of objects. An format function will be used to convert the data passed to the Select component to DetailOption[]. The processed data then is passed to the ListboxOptionsComponent.

// When an array of strings is passed, the string will be used as the text and the value. UUID will be used to generate an id.

// When an array of objects is passed, the value property is required.
// If text is not provided, the value will be used. (possibly capitalize it)
// If id is not provided, uuid will be used to generate one. (uuid will not be used )
export type SimpleSelectOption = string | number;

export interface ObjectSelectOption {
  value: any; // You can specify the type of `value` if it's known, e.g., `string`, `number`, etc.
  text?: string;
  id?: string | number;
  [key: string]: any; // This allows for additional properties of any type
}

export type SelectOption = SimpleSelectOption | ObjectSelectOption;

export type DetailOption = {
  // A unique identifier for the option and it's used as a key
  id: string | number;
  // The actual value that the option represents
  value: string | number;
  // Text displayed in the list. It's optional. If not provided, the value will be used
  text: string;
};
