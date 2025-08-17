import prisma from "@/lib/prisma";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  async function main() {
    try {
      const user = await prisma.user.findFirst();
      console.log("✅ DB connected. Sample user:", user);
    } catch (err) {
      console.error("❌ DB connection failed:", err);
    }
  }

  main();
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton/>
          <SignUpButton>
            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <h1>This is landing page</h1>
    </>
  );
}
