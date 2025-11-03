type Props = { name: string; text: string };

export default function TestimonialCard({ name, text }: Props) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <p className="text-gray-700 mb-4 italic">“{text}”</p>
      <h4 className="text-blue-700 font-semibold">{name}</h4>
    </div>
  );
}
