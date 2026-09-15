import { getImageProps } from "next/image";

export function HeroLcpPreload({ src }: { src?: string }) {
  if (!src || src.startsWith("blob:") || src.startsWith("data:")) return null;

  try {
    const { props } = getImageProps({
      src,
      alt: "",
      width: 1920,
      height: 1080,
      sizes: "100vw",
      quality: 60,
      priority: true,
    });

    return (
      <link
        rel="preload"
        as="image"
        href={props.src}
        imageSrcSet={props.srcSet}
        imageSizes={props.sizes}
        fetchPriority="high"
      />
    );
  } catch {
    return null;
  }
}
