import RegisterForm from "../../components/autentication/RegisterForm";
import ImageCard from "../../components/autentication/ImageCard";
export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/brick-wall.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-3xl flex flex-col-reverse md:flex-row w-full max-w-sm md:max-w-none md:w-[85%] lg:w-[50%] xl:w-[40%]">
        <ImageCard
          imageUrl="/barberia-register.jpg"
          position="left"
          height="h-[500px]"
        />
        <RegisterForm />
      </div>
    </div>
  );
}
