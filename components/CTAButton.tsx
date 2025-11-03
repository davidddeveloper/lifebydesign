type Props = { href: string; label: string };

export default function CTAButton({ href, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
    >
      {label}
    </a>
  );
}
