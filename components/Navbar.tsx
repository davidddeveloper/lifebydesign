import Link from "next/link";
import CTAButton from "./CTAButton";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-700">Life By Design</Link>
      <div className="flex gap-6 items-center">
        <Link href="/about">About</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/media">Media</Link>
        <Link href="/partners">Partners</Link>
        <Link href="/contact">Contact</Link>
        <CTAButton href="https://go.lifebydesign.africa/workshop" label="Join Workshop" />
      </div>
    </nav>
  );
}
