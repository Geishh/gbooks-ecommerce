import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import UserOrders from "./pages/UserOrders";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBooks from "./pages/admin/Books";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import Navigation from "./components/Navigation";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/book/:id" component={BookDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-success" component={OrderSuccess} />
      
      {/* Protected User Routes */}
      <Route path="/orders" component={UserOrders} />
      
      {/* Admin Routes */}
      {isAdmin && <Route path="/admin" component={AdminDashboard} />}
      {isAdmin && <Route path="/admin/books" component={AdminBooks} />}
      {isAdmin && <Route path="/admin/orders" component={AdminOrders} />}
      {isAdmin && <Route path="/admin/users" component={AdminUsers} />}
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
