import CTAButton from "./CTAButton";

export default function Hero() {
  return (
    <section className="h-[80vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <h1 className="text-5xl font-bold mb-6 max-w-2xl">
        Design the Life and Business You Were Meant to Lead
      </h1>
      <p className="text-lg mb-8 max-w-xl">
        Join the movement of purpose-driven entrepreneurs creating real impact across Africa.
      </p>
      <CTAButton href="/workshops" label="Start Your Journey" />
    </section>
  );
}
