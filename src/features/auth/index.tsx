import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleLogo } from "@phosphor-icons/react";
import { Github } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/store/useUser";
import { authgoogle, signIn, signUp } from "./auth";
import { useState } from "react";
import { useSetUser } from "./useSetUser";
import Link from "next/link";
import { useGetUser } from "@/hooks/article/useGetUser";

export type FormValues = {
  email: string;
  password: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const FormCard: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const { mutate } = useSetUser();
  const { setUser, user } = useUser();
  const { data: data_user } = useGetUser(user.email);
  const router = useRouter();

  const handleAuth = async (values: FormValues) => {
    try {
      const user = isSignUp ? await signUp(values) : await signIn(values);

      const formData = new FormData();
      formData.append("name", user.displayName ? user.displayName : "");
      formData.append("profil_img", user.photoURL ? user.photoURL : "");
      formData.append("pronouns", "writer");
      formData.append("short_bio", "i`m a writer");
      formData.append("email", user.email ? user.email : "");
      mutate(formData);
      setUser(data_user);
      if (data_user) {
        localStorage.setItem("user", JSON.stringify(data_user));
        router.back();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const user = await authgoogle();
      const value = {
        name: user.displayName,
        profil_img: user.photoURL,
        pronouns: "writer",
        short_bio: "",
        email: user.email,
      };
      mutate(value);
      setUser(data_user);
      if (data_user) {
        localStorage.setItem("user", JSON.stringify(data_user));
        router.back();
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleAuth,
  });

  return (
    <Card className="mx-auto my-8 w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Sign Up" : "Sign In"}</CardTitle>
        <CardDescription>Please fill in the form below</CardDescription>
        <div className="flex w-full items-center justify-center gap-2 pt-4">
          <Button className="w-full" variant="outline">
            <Github className="mr-2 size-4" /> Github
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleGoogleAuth}
          >
            <GoogleLogo className="mr-2 size-4" /> Google
          </Button>
        </div>
      </CardHeader>
      <div className="-mt-2 mb-2 flex w-full items-center justify-center gap-2 text-sm">
        <hr className="w-full" />
        <p className="w-fit whitespace-nowrap">OR CONTINUE WITH</p>
        <hr className="w-full" />
      </div>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
              className="mt-1 block w-full"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
              className="mt-1 block w-full"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500">{formik.errors.password}</div>
            )}
          </div>
          <p>
            {isSignUp ? "sudah punya akun?" : "belum punya akun?"}{" "}
            <span
              className="text-blue-700"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              {isSignUp ? "masuk" : "buat akun?"}
            </span>
          </p>
          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormCard;
