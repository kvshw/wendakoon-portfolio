import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";

const DEFAULT_ADMIN_URL = "/admin/content-engine";

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl={DEFAULT_ADMIN_URL}
        forceRedirectUrl={DEFAULT_ADMIN_URL}
      />
    </AuthShell>
  );
}
