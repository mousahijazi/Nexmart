import { Card, Button } from "@/index";

export default function WhySection() {
  return (
    <div className="py-20 sm:py-24 lg:py-36 px-3 sm:px-6 md:px-12 bg-[#F7F4EF]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#5B3A21]">
          Why Nexmart?
        </h2>
        <p className="text-gray-600 mt-3">
          We provide the best shopping experience for our customers.
        </p>
        <Card />
        <Button title="Learn More About Us" link="about" />
      </div>
    </div>
  );
}