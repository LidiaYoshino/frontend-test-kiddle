import * as Avatar from "@radix-ui/react-avatar";

interface UserAvatarProps {
  name: string;
}

export function UserAvatar({ name }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-brand-100 align-middle">
      <Avatar.Image className="h-full w-full object-cover" src="" alt={name} />
      <Avatar.Fallback className="text-sm font-semibold text-brand-700" delayMs={300}>
        {initials}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
