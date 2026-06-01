export type FormProps<T> = {
  onSubmit: (data: T) => Promise<void> | void;
  initialValues?: Partial<T>;
  isEditing?: boolean;
  onCancel?: () => void;
};

export type AsyncFormProps<T> = FormProps<T> & {
  isLoading?: boolean;
};
