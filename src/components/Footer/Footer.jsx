import {Pages, Utility, Text, Contact} from "@/index";

export default function Footer() {
  return (
    <footer className="w-full bg-[#e3dfd7] mt-auto px-5">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 min-[480px]:grid-cols-2 md:gap-12 md:grid-cols-4 gap-7">
          <Pages />
          <Utility />
          <Text />
          <Contact />
      </div>
      <div className="border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-700">
          © 2026 Nexmart. All rights reserved.
        </p>
      </div>
    </footer>
  )
}