import { Outlet } from "react-router";
import { Toaster } from "./ui/sonner";

export default function Layout() {
  return (
    <main className="h-screen w-screen">
      <Outlet />
      <Toaster />
    </main>
  )
}