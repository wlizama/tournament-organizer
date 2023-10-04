import { Metadata } from "next";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Luna Ai",
};

export default function LoginPage() {
  return (
    <div className="pattern-bg bg-repeat h-screen flex justify-center items-center bg-indigo-950">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
          Tournament Organizer
          </h1>
          <h2 className="text-2xl my-4 tracking-tight">
            Log in
          </h2>
        <UserAuthForm />
      </div>
    </div>
  );
}
