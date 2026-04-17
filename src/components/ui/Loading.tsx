interface LoadingProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    container: "gap-1.5 text-xs",
    spinner: "h-3 w-3 border-[1.5px]"
  },
  md: {
    container: "gap-2 text-sm",
    spinner: "h-4 w-4 border-2"
  },
  lg: {
    container: "gap-3 text-base",
    spinner: "h-5 w-5 border-2"
  }
};

export function Loading({ message = "Loading...", className, size = "md" }: LoadingProps) {
  const classes = sizeClasses[size];

  return (
    <div className={className ?? `flex items-center text-slate-600 ${classes.container}`}>
      <span
        className={`inline-block animate-spin rounded-full border-slate-300 border-t-slate-600 ${classes.spinner}`}
        aria-hidden="true"
      />
      <p>{message}</p>
    </div>
  );
}
