"use client";

import * as React from "react";
import { IconMenuDeep, IconX } from "@tabler/icons-react";
import logo from "../../assets/pioneer-aushadhisewa.png";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  logoutUser,
  checkSession,
  login,
  signup,
  googleSignIn,
  clearError,
  clearEmailConfirmation,
  resendEmail,
} from "@/features/auth/authSlice";
import { Button, LiquidButton } from "../ui/liquid-glass-button";
import CartIcon from "../cart/CartIcon";
import CartDrawer from "../cart/CartDrawer";
import { AuthDialog } from "../auth/AuthDialog";
import { Package } from "lucide-react";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { toast } from "sonner";
export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);
  const dispatch = useAppDispatch();
  const { user, loading, error, requiresEmailConfirmation, confirmationEmail } =
    useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear error when dialog closes
  React.useEffect(() => {
    if (!authDialogOpen) {
      dispatch(clearError());
    }
  }, [authDialogOpen, dispatch]);

  const handleOpenLogin = () => {
    setIsSignup(false);
    setAuthDialogOpen(true);
  };

  const handleAuthSubmit = async (data: any) => {
    try {
      if (isSignup) {
        await dispatch(signup(data)).unwrap();

        toast.success("Please check your email to confirm your account");
      } else {
        await dispatch(login(data)).unwrap();
        toast.success("Login successful");
      }
      setAuthDialogOpen(false);
    } catch (error) {
      toast.error("Authentication failed:");
    }
  };

  const handleGoogleClick = async () => {
    try {
      await dispatch(googleSignIn()).unwrap();

      setAuthDialogOpen(false);
    } catch (error) {
      toast.error("Google authentication failed:");
    }
  };

  const handleResendEmail = async () => {
    try {
      if (!confirmationEmail) {
        toast.error("No email address found for resending");
        return;
      }

                
      await dispatch(resendEmail(confirmationEmail)).unwrap();
      toast.success("Confirmation email sent! Please check your inbox");
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Failed to resend email";
      toast.error(errorMessage);
    }
  };

  const handleCloseEmailConfirmation = () => {
    dispatch(clearEmailConfirmation());
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0  left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-transparent backdrop-blur-md shadow-lg rounded-2xl mx-4 mt-2"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 p-4">
              {/* Medical logo icon (Tabler Heartbeat) */}
              <img src={logo} alt="Pioneer Aushadhi Sewa" className="w-16 h-16 rounded-full" />
              <a
                href="/"
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-medical-green-700" : "text-medical-green-700"
                }`}
              >
                Pioneer Aushadhi Sewa
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:scale-105  ${
                      isScrolled
                        ? "text-gray-700 hover:text-gray-900 "
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA & Cart Button */}
            <div className="hidden md:flex items-center gap-4">
              <CartIcon />
              {user ? (
                <>
                  <Button
                    onClick={() => navigate("/orders")}
                    className="flex items-center gap-2 h-10 rounded-full text-black"
                  >
                    <Package className="w-5 h-5" />
                    <span className="text-sm">My Orders</span>
                  </Button>
                  {user?.role === "admin" && (
                    <Select
                      onValueChange={(value) => {
                        if (value === "orders") navigate("/admin/orders");
                        if (value === "dashboard") navigate("/admin/dashboard");
                        if (value === "statistics") navigate("/admin/statistics");
                      }}
                    >
                      <SelectTrigger className="w-[200px] h-10 rounded-full border-4 border-blue-500 text-black">
                        <SelectValue
                          className="text-black"
                          placeholder="Admin"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-black">
                            Admin
                          </SelectLabel>
                          <SelectItem value="orders" className="text-black">
                            Orders Management
                          </SelectItem>
                          <SelectItem value="dashboard" className="text-black">
                            Product Management
                          </SelectItem>
                          <SelectItem value="statistics" className="text-black">
                            Statistics
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  <LiquidButton
                    onClick={() => dispatch(logoutUser())}
                    className={`h-10 rounded-full text-black ${
                      isScrolled ? " text-black" : "bg-white text-gray-900"
                    }`}
                  >
                    Logout
                  </LiquidButton>
                </>
              ) : (
                <div className="flex gap-2">
                  <LiquidButton
                    onClick={handleOpenLogin}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 transform ${
                      isScrolled
                        ? "text-gray-900 shadow-lg h-10 rounded-full"
                        : "bg-white text-gray-900 shadow-lg h-10 rounded-full"
                    }`}
                  >
                    Login
                  </LiquidButton>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-300 ${
                  isScrolled
                    ? "text-black hover:text-gray-900 hover:bg-gray-100"
                    : "text-black hover:text-white hover:bg-white/10"
                }`}
              >
                {isMobileMenuOpen ? (
                  <IconX size={24} />
                ) : (
                  <IconMenuDeep size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden transition-all duration-300 ${
              isScrolled
                ? "bg-white/5 text-black backdrop-blur-md shadow-lg"
                : " bg-white/5 text-black backdrop-blur-md"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-black hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                {user ? (
                  <>
                    <Button
                      onClick={() => navigate("/orders")}
                      className="flex items-center gap-2 h-10 rounded-full text-black"
                    >
                      <Package className="w-5 h-5" />
                      <span className="text-sm">My Orders</span>
                    </Button>
                    {user?.role === "admin" && (
                      <>
                        <Button
                          onClick={() => navigate("/admin/orders")}
                          className="h-10 rounded-full text-black"
                        >
                          Orders Management
                        </Button>
                        <Button
                          onClick={() => navigate("/admin/dashboard")}
                          className="h-10 rounded-full text-black"
                        >
                          Product Management
                        </Button>
                      </>
                    )}

                    <LiquidButton
                      onClick={() => dispatch(logoutUser())}
                      className={`h-10 w-full  rounded-full text-black ${
                        isScrolled ? "bg-white text-black" : " text-black"
                      }`}
                    >
                      Logout
                    </LiquidButton>
                  </>
                ) : (
                  <>
                    <LiquidButton
                      onClick={handleOpenLogin}
                      className={`px-6 py-2 w-full text-black rounded-full font-semibold transition-all duration-300 transform ${
                        isScrolled
                          ? "bg-white shadow-lg h-10 rounded-full"
                          : " text-gray-900 shadow-lg h-10 rounded-full"
                      }`}
                    >
                      Login
                    </LiquidButton>
                  </>
                )}

                {/* Cart Icon for Mobile */}
                <CartIcon />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSubmit={handleAuthSubmit}
        onGoogleClick={handleGoogleClick}
        isSignup={isSignup}
        onToggleMode={setIsSignup}
        loading={loading}
        googleLoading={loading}
        error={error}
        requiresEmailConfirmation={requiresEmailConfirmation}
        confirmationEmail={confirmationEmail}
        onResendEmail={handleResendEmail}
        onCloseEmailConfirmation={handleCloseEmailConfirmation}
      />

      {/* Spacer to prevent content from hiding behind navbar */}
      <div className="h-16" />
    </>
  );
}
