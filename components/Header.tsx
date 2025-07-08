"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Menu = { label: string; href: string };

const menusAdmin: Menu[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Tiket", href: "/admin/tickets" },
  { label: "Voucher", href: "/admin/vouchers" },
  { label: "Order", href: "/admin/orders" },
];

const menusUser: Menu[] = [
  { label: "Tiket", href: "/tickets" },
  { label: "Order Saya", href: "/orders" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Function untuk fetch user
  const fetchUser = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .single();
      if (data) setUser({ name: data.name ?? "User", role: data.role });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser(); // Fetch on mount

    // Listen to Supabase Auth event
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      // event: "SIGNED_IN", "SIGNED_OUT", "TOKEN_REFRESHED", etc
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // setUser(null); // Not needed, event listener akan update state
    router.push("/login");
  };

  if (loading) return null; // or skeleton

  if (!user) return null;

  const menus = user.role === "admin" ? menusAdmin : menusUser;

  return (
    <header className="w-full bg-white border-b border-blue-100 shadow-sm sticky top-0 z-30">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo & Nama */}
        <div className="flex items-center gap-2 text-xl font-extrabold text-blue-600">
          <span className="bg-blue-100 rounded-full p-2 text-2xl shadow">
            ✈️
          </span>
          <span>VoyaTrax</span>
        </div>

        {/* MENU */}
        <div className="flex gap-2 md:gap-4 items-center">
          {menus.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`px-4 py-2 rounded-xl font-medium transition
                ${
                  pathname === m.href
                    ? "bg-blue-100 text-blue-700 font-bold shadow"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
            >
              {m.label}
            </Link>
          ))}
        </div>

        {/* Nama User & Logout */}
        <div className="flex items-center gap-3">
          <span className="text-blue-700 font-semibold text-sm px-3 py-2 rounded-xl bg-blue-50 shadow-sm">
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow transition"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
