import { AboutHero, StorySection, ValuesSection, StatisticsSection, DeveloperSection } from "@/index";
 
export default function About() {
  return (
    <div className="bg-[#F7F4EF] dark:bg-zinc-900">
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <StatisticsSection />
      <DeveloperSection />
    </div>
  );
}