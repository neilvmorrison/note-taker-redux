import LoginForm from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icons";
import { app_name } from "@/constants";

export default function Authentication() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div>
        <div className="flex justify-center items-center gap-3 mb-12">
          <Icon name="logo" />
          <h1 className="text-center text-2xl font-bold">{app_name}</h1>
        </div>
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
