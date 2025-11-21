"use client";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "../../utils/handleApiError";
import { Link, useNavigate } from "react-router-dom";
import api from "../../app/axiosInstance";
import { useDispatch} from "react-redux";
import { setUser } from "../../features/userSlice";

interface ValidationErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValidate = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValidate = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValidate = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      isValidate = false;
    } 

    setErrors(newErrors);
    return isValidate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!validate()) {
      setIsLoading(false);
      return;
    }

    try {
       const result = await api.post('/api/user/login',{
        email,
        password,
       });

       console.log('result',result);
      setIsLoading(false);
      toast.success(result?.data?.msg)
      dispatch(setUser({id:result?.data?.user?.id,email:result.data?.user?.email}))
      navigate('/home');
    } catch (error) {
        console.log(error);
      toast.error(handleApiError(error))
    }
  };

  const isFormValid = !errors.email && !errors.password && email && password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium block">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="w-full"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-gray-600 pt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <ToastContainer autoClose = {200}/>
    </div>
  );
}