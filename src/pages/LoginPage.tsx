import LoginForm from "../components/LoginForm";
import LoginImage from "../components/LoginImage";
function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: "url('/brick-wall.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-3xl flex flex-col-reverse lg:flex-row w-[43%] max-w-2xl ">
        <LoginForm />
        <LoginImage />
      </div>
    </div>
  );
}

export default LoginPage;
