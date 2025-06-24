import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { login, register, resetPassword, clearError } from "@/store/slices/authSlice";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { LoginCredentials, RegisterData, ResetPasswordData } from "@/types/auth";

type AuthMode = "login" | "register" | "reset";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component mounts or mode changes
  useEffect(() => {
    dispatch(clearError());
    setValidationErrors({});
    setResetEmailSent(false);
  }, [mode, dispatch]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (mode !== "reset") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      if (mode === "register") {
        if (!formData.name) {
          errors.name = "Name is required";
        } else if (formData.name.length < 2) {
          errors.name = "Name must be at least 2 characters";
        }

        if (!formData.confirmPassword) {
          errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "login") {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        };
        await dispatch(login(credentials)).unwrap();
      } else if (mode === "register") {
        const registerData: RegisterData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: "user",
        };
        await dispatch(register(registerData)).unwrap();
      } else if (mode === "reset") {
        const resetData: ResetPasswordData = {
          email: formData.email,
        };
        await dispatch(resetPassword(resetData)).unwrap();
        setResetEmailSent(true);
      }
    } catch (error) {
      // Error is handled by Redux slice
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      rememberMe: false,
    });
    setValidationErrors({});
    dispatch(clearError());
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const renderDemoCredentials = () => (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</h4>
      <div className="text-xs text-blue-700 space-y-1">
        <div>
          <strong>Admin:</strong> admin@jslwbistro.com / admin123
        </div>
        <div>
          <strong>User:</strong> user@jslwbistro.com / user123
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <BarChart3 className="w-12 h-12 text-oxford_blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">JSLW Bistro</h1>
                <p className="text-sm text-gray-600">Business Intelligence</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            {mode === "login" && "Sign in to your account"}
            {mode === "register" && "Create your account"}
            {mode === "reset" && "Reset your password"}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {mode === "login" && (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={() => switchMode("register")} className="font-medium text-oxford_blue-600 hover:text-oxford_blue-500">
                  Sign up here
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")} className="font-medium text-oxford_blue-600 hover:text-oxford_blue-500">
                  Sign in here
                </button>
              </>
            )}
            {mode === "reset" && (
              <>
                Remember your password?{" "}
                <button type="button" onClick={() => switchMode("login")} className="font-medium text-oxford_blue-600 hover:text-oxford_blue-500">
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>

        {/* Demo Credentials (only in development) */}
        {import.meta.env.DEV && mode === "login" && renderDemoCredentials()}

        {/* Success Message for Password Reset */}
        {resetEmailSent && mode === "reset" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <h4 className="text-sm font-semibold text-green-800">Email sent!</h4>
                <p className="text-sm text-green-700 mt-1">Check your email for password reset instructions.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">Authentication Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Field (Register only) */}
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={mode === "register"}
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent ${
                      validationErrors.name ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent ${
                    validationErrors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
            </div>

            {/* Password Field (not for reset) */}
            {mode !== "reset" && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent ${
                      validationErrors.password ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
                {validationErrors.password && <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>}
              </div>
            )}

            {/* Confirm Password Field (Register only) */}
            {mode === "register" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent ${
                      validationErrors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password (Login only) */}
          {mode === "login" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-oxford_blue-600 focus:ring-oxford_blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" onClick={() => switchMode("reset")} className="text-sm font-medium text-oxford_blue-600 hover:text-oxford_blue-500">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || (resetEmailSent && mode === "reset")}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-oxford_blue-600 hover:bg-oxford_blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford_blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              {mode === "login" && (loading ? "Signing in..." : "Sign in")}
              {mode === "register" && (loading ? "Creating account..." : "Create account")}
              {mode === "reset" && (loading ? "Sending email..." : resetEmailSent ? "Email sent" : "Send reset email")}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-oxford_blue-600 hover:text-oxford_blue-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-oxford_blue-600 hover:text-oxford_blue-500">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
