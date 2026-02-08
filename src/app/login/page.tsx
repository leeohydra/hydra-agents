import { LoginForm } from "./LoginForm";
import { LoginPageLayout } from "./LoginPageLayout";

export default function LoginPage() {
  return (
    <LoginPageLayout title="Sign in">
      <LoginForm />
    </LoginPageLayout>
  );
}
