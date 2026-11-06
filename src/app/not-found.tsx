import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">ERR_404 / Route not found</p>
      <h1>Signal lost.</h1>
      <p>The requested route is outside this portfolio system.</p>
      <Link className="button button-primary" href="/">
        <ArrowLeft aria-hidden="true" size={17} /> Return home
      </Link>
    </main>
  );
}

