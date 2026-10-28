export type EntityId = string;

export type PhoneNumber = string;

export type FormErrors<TFields extends object> = Partial<
  Record<keyof TFields, string>
>;

export type ValidationResult<TValue, TFields extends object = object> =
  | { isValid: true; value: TValue }
  | { isValid: false; errors: FormErrors<TFields> };
