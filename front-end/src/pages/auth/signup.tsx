import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "../../utils/handleApiError";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Signup } from "../../services/User";
export function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = useSelector((state:RootState)=> state.user.id);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate('/home');
    }
  },[user,navigate]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValidate = true;
    // Validation
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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValidate = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValidate = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValidate = false;
    }

    setErrors(newErrors);

    return isValidate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await Signup(email,password)
      console.log('result',data);
      toast.success(data?.msg);
      navigate('/')
    } catch (error) {
      console.log(error);
      toast.error(handleApiError(error));
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "1rem",
      }}
    >
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        <div className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={errors.email ? "border-red-500" : ""}
              
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className={errors.password ? "border-red-500" : ""}
              
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: "" });
              }}
              className={errors.confirmPassword ? "border-red-500" : ""}
             
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-8 font-semibold py-6"
           
          >
           Sign Up
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
      <ToastContainer autoClose={200} />
    </div>
  );
}
