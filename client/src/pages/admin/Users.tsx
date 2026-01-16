import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const { data: users } = trpc.users.list.useQuery({ limit: 50 });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-heading">Manajemen Pengguna</h1>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="border border-border p-4 flex items-center justify-between hover:border-accent transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{user.name || "User"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {user.email || "No email"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-accent text-accent-foreground"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.lastSignedIn).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada pengguna</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
