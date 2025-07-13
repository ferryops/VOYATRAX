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
  { label: "Airports", href: "/admin/airports" },
  { label: "Airlines", href: "/admin/airlines" },
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
  const [showMenu, setShowMenu] = useState(false);

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
    fetchUser();

    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return null;

  if (!user) return null;

  const menus = user.role === "admin" ? menusAdmin : menusUser;

  return (
    <header className="w-full bg-white border-b border-blue-100 shadow-sm sticky top-0 z-30">
      <nav className="mx-auto flex items-center justify-between px-4 py-3 relative">
        <div className="flex items-center gap-2 text-xl font-extrabold text-blue-600">
          <span className="bg-blue-100 rounded-full p-2 text-2xl shadow">
            ✈️
          </span>
          <span>VoyaTrax</span>
        </div>

        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          className={`
            flex-col md:flex-row md:flex gap-2 md:gap-4 items-center
            absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow md:shadow-none
            z-20 transition-all duration-300
            ${showMenu ? "flex" : "hidden"} md:flex
          `}
        >
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
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
                onClick={() => setShowMenu(false)}
              >
                {m.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto items-center md:ml-4 border-t md:border-t-0 pt-2 md:pt-0 mt-2 md:mt-0">
            <span className="text-blue-700 font-semibold text-sm px-3 py-2 rounded-xl bg-blue-50 shadow-sm">
              {user.name}
            </span>
            <button
              onClick={() => {
                setShowMenu(false);
                handleLogout();
              }}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow transition"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
