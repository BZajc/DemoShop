import { Suspense } from "react";
import SignForm from "@/app/components/sign/SignContainer";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignForm />
    </Suspense>
  );
}
