import LoginForm from "@/components/login-form";
import Logo from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Authentication() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center mb-4">
          <Logo />
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
