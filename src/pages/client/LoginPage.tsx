import LoginForm from "../../components/ui/LoginForm";
import SideImage from "../../components/ui/ImageCard";
export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: "url('/brick-wall.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-3xl flex flex-col-reverse lg:flex-row w-[43%] max-w-2xl ">
        <LoginForm />
        <SideImage imageUrl="/barberia-login.jpg" />
      </div>
    </div>
  );
}
