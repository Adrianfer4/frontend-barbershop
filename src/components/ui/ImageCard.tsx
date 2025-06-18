interface ImageCardProps {
  imageUrl: string;           // Ruta local importada o URL externa
  position?: "left" | "right"; // Lado donde va el borde redondeado
  height?: string;             // Altura opcional (ej: h-[400px])
}

export default function ImageCard({
  imageUrl,
  position = "right",
  height = "h-[440px]",
}: ImageCardProps) {
  const borderRadiusClass =
    position === "right" ? "rounded-r-2xl" : "rounded-l-2xl";

  return (
    <div className="hidden lg:flex items-center justify-center">
      <img
        src={imageUrl}
        alt="Imagen de la barbería"
        className={`shadow-md object-cover w-full ${height} ${borderRadiusClass}`}
      />
    </div>
  );
}
