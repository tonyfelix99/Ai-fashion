import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Users, Shirt, Palette, ShoppingCart, ArrowLeft, LogOut } from "lucide-react";
import { logout } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();

  const { data: stats } = useQuery<{
    totalUsers: number;
    totalModels: number;
    totalFabrics: number;
    totalOrders: number;
    totalTrials: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-user-dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  User View
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Models</CardTitle>
              <Shirt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalModels || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fabrics</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFabrics || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-elevate transition-all">
            <CardHeader>
              <CardTitle>Manage Models</CardTitle>
              <CardDescription>Add, edit, or remove clothing models</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/models">
                <Button className="w-full" data-testid="link-admin-models">
                  <Shirt className="mr-2 h-4 w-4" />
                  Manage Models
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader>
              <CardTitle>Manage Fabrics</CardTitle>
              <CardDescription>Add, edit, or remove fabric options</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/fabrics">
                <Button className="w-full" data-testid="link-admin-fabrics">
                  <Palette className="mr-2 h-4 w-4" />
                  Manage Fabrics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader>
              <CardTitle>View Orders</CardTitle>
              <CardDescription>Monitor and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/orders">
                <Button className="w-full" data-testid="link-admin-orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {stats && stats.totalTrials > 0 && (
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>AI Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-primary mb-2">{stats.totalTrials}</div>
                <p className="text-muted-foreground">Total Virtual Try-Ons Generated</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
