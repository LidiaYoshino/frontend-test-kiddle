interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return <p className={className ?? "rounded-lg bg-red-50 p-3 text-sm text-red-700"}>{message}</p>;
}
