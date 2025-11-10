import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Models from "@/pages/Models";
import Fabrics from "@/pages/Fabrics";
import TryOn from "@/pages/TryOn";
import Cart from "@/pages/Cart";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminModels from "@/pages/admin/AdminModels";
import AdminFabrics from "@/pages/admin/AdminFabrics";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { handleRedirect } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";

function AuthHandler() {
  const { firebaseUser, setUser } = useAuth();

  useEffect(() => {
    handleRedirect();
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      const syncUser = async () => {
        try {
          const idToken = await firebaseUser.getIdToken();
          const userData = await apiRequest("POST", "/api/auth/sync", {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName!,
            photoUrl: firebaseUser.photoURL,
          });
          setUser(userData);
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      };
      syncUser();
    }
  }, [firebaseUser, setUser]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/models">
        <ProtectedRoute>
          <Models />
        </ProtectedRoute>
      </Route>

      <Route path="/fabrics">
        <ProtectedRoute>
          <Fabrics />
        </ProtectedRoute>
      </Route>

      <Route path="/try-on">
        <ProtectedRoute>
          <TryOn />
        </ProtectedRoute>
      </Route>

      <Route path="/cart">
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute>
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        </ProtectedRoute>
      </Route>

      <Route path="/admin/models">
        <ProtectedRoute>
          <AdminRoute>
            <AdminModels />
          </AdminRoute>
        </ProtectedRoute>
      </Route>

      <Route path="/admin/fabrics">
        <ProtectedRoute>
          <AdminRoute>
            <AdminFabrics />
          </AdminRoute>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthHandler />
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
