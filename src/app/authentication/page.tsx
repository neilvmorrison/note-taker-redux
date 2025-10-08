import LoginForm from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { app_name } from "@/constants";

export default function Authentication() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div>
        <h1 className="text-center text-2xl font-bold mb-12">{app_name}</h1>
        <Card className="w-[360px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email below to receive a magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
