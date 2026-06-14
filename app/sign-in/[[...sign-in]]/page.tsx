import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";

const DEFAULT_ADMIN_URL = "/admin/content-engine";

type Props = {
  searchParams: Promise<{ redirect_url?: string }>;
};

function resolveRedirectUrl(redirectUrl?: string) {
  if (redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
    return redirectUrl;
  }
  return DEFAULT_ADMIN_URL;
}

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const afterSignInUrl = resolveRedirectUrl(params.redirect_url);

  return (
    <AuthShell>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl={afterSignInUrl}
        forceRedirectUrl={afterSignInUrl}
      />
    </AuthShell>
  );
}
