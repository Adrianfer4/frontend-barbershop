import LoginForm from "../../components/autentication/LoginForm";
import SideImage from "../../components/autentication/ImageCard";
export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/brick-wall.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-3xl flex flex-col-reverse md:flex-row w-full md:w-[85%] lg:w-[50%] xl:w-[40%] max-w-4xl">
        <LoginForm />
        <SideImage imageUrl="/barberia-login.jpg" />
      </div>
    </div>
  );
}
