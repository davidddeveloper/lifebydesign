import Link from "next/link";
import CTAButton from "./CTAButton";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-700">Startup Bodyshop</Link>
      <div className="flex gap-6 items-center">
        <Link href="/about">About</Link>
        <Link href="/workshops">Workshops</Link>
        <Link href="/media/blog">Blog</Link>
        <Link href="/partner">Partner</Link>
        <Link href="/careers">Careers</Link>
        <CTAButton href="/workshops" label="Join Workshop" />
      </div>
    </nav>
  );
}
