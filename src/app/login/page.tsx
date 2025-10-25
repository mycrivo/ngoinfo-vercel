import LoginForm from "@/features/auth/LoginForm";

export const metadata = {
  title: "Sign In - NGOInfo",
  description: "Sign in to your NGOInfo account",
};

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
