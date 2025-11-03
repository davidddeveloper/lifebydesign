type Props = { title: string; text: string };

export default function Section({ title, text }: Props) {
  return (
    <section className="p-12 text-center">
      <h2 className="text-3xl font-semibold mb-4 text-blue-700">{title}</h2>
      <p className="max-w-3xl mx-auto text-gray-600">{text}</p>
    </section>
  );
}
