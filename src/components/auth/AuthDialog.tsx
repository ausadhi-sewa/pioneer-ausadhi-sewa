import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "./GoogleButton";
import { EmailConfirmationDialog } from "./EmailConfirmationDialog";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LoginFormData | Omit<SignupFormData, 'confirmPassword'>) => void;
  onGoogleClick: () => void;
  isSignup?: boolean;
  onToggleMode?: (nextIsSignup: boolean) => void;
  loading?: boolean;
  googleLoading?: boolean;
  error?: string | null;
  requiresEmailConfirmation?: boolean;
  confirmationEmail?: string | null;
  onResendEmail?: () => void;
  onCloseEmailConfirmation?: () => void;
}

export function AuthDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onGoogleClick, 
  isSignup = false, 
  onToggleMode,
  loading = false, 
  googleLoading = false,
  error,
  requiresEmailConfirmation = false,
  confirmationEmail,
  onResendEmail,
  onCloseEmailConfirmation
}: AuthDialogProps) {
  const schema = isSignup ? signupSchema : loginSchema;
  
  const form = useForm<SignupFormData | LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: isSignup ? {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    } : {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: SignupFormData | LoginFormData) => {
    if (isSignup) {
      // Remove confirmPassword for signup API
      const { confirmPassword, ...signupData } = data as SignupFormData;
      onSubmit(signupData);
    } else {
      // Only email and password for login
      const { email, password } = data as LoginFormData;
      onSubmit({ email, password });
    }
  };

  const title = isSignup ? "Create Account" : "Welcome Back !";
  const subtitle = isSignup 
    ? "Enter your details to create a new account" 
    : "Enter your credentials to access your account";

  const handleToggle = () => onToggleMode?.(!isSignup);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent key={isSignup ? "signup" : "login"} className="max-w-md rounded-4xl">
          <DialogHeader className="text-center space-y-2">
          
            <DialogTitle className="text-2xl font-bold text-center text-neutral-800">{title}</DialogTitle>
            <DialogDescription className="text-neutral-600 text-center">{subtitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
          <div className="text-center">
             
             <GoogleButton 
               onClick={onGoogleClick} 
               loading={googleLoading}
               children={isSignup ? "Continue with Google" : "Continue with Google"}
             />
                <Separator className="my-6" />
              <p className="text-sm text-neutral-600 mb-4">Or continue with</p>
           </div>
          
        
            {error && (
              <Alert variant="destructive">
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {isSignup && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isSignup && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button type="submit" className="w-full rounded-4xl shadow-2xl bg-accent" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {isSignup ? "Creating Account..." : "Signing In..."}
                    </div>
                  ) : (
                    isSignup ? "Create Account" : "Login"
                  )}
                </Button>
                <div className="text-center text-sm text-neutral-600">
                  <span>{isSignup ? "Already have an account?" : "Don't have an account?"} </span>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="font-medium text-medical-green-600 hover:text-medical-green-700 underline underline-offset-2"
                  >
                    {isSignup ? "Login" : "Sign Up"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Confirmation Dialog */}
      {requiresEmailConfirmation && confirmationEmail && (
        <EmailConfirmationDialog
          open={requiresEmailConfirmation}
          email={confirmationEmail}
          onResendEmail={onResendEmail}
          onClose={onCloseEmailConfirmation}
        />
      )}
    </>
  );
}
