import { Suspense } from "react";
import SignForm from "@/app/components/sign/SignContainer";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <Suspense fallback={<Loader2 />}>
      <SignForm />
    </Suspense>
  );
}
