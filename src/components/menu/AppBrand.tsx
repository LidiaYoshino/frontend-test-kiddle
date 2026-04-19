import planetUrl from "../../assets/planet.png";
import logoOrangeUrl from "../../assets/logo-orange.png";

interface AppBrandProps {
  className?: string;
}

export function AppBrand({ className = "" }: AppBrandProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={planetUrl}
        alt=""
        aria-hidden
        width={48}
        height={48}
        decoding="async"
        loading="eager"
        fetchPriority="high"
        className="h-12 w-12 shrink-0 object-contain"
      />
      <img
        src={logoOrangeUrl}
        alt="Kiddle Pass"
        decoding="async"
        loading="eager"
        fetchPriority="high"
        className="h-8 w-auto shrink-0 object-contain"
      />
    </div>
  );
}
