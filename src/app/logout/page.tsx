import Logout from "@/features/auth/Logout";

export const metadata = {
  title: "Sign Out - NGOInfo",
  description: "Sign out of your NGOInfo account",
};

export default function LogoutPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <Logout />
    </div>
  );
}

