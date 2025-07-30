import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoaderBarbershop = ({
  mensaje = "Cargando...",
}: {
  mensaje?: string;
}) => {
  return (
    <>
      <DotLottieReact
        src="https://lottie.host/d8cd8f9a-cfc3-42b0-8ef7-9a4720dae881/ZEQhfRqGYr.lottie"
        loop
        autoplay
      />
      <p className="text-sm text-gray-600">{mensaje}</p>
    </>
  );
};

export default LoaderBarbershop;
