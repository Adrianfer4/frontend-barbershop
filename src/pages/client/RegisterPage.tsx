import RegisterForm from "../../components/autentication/RegisterForm";
import ImageCard from "../../components/autentication/ImageCard";
export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: "url('/brick-wall.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-3xl flex flex-col-reverse lg:flex-row w-[43%] max-w-2xl ">
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
