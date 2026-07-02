"use client";

import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoginPage) return <>{children}</>;

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Sair do painel
        </button>
      </div>
      {children}
    </div>
  );
}
