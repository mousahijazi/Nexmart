"use client"
import { useState } from "react";
import { OverviewHero, OverviewStatsGrid, ProductModal } from "@/index";

export default function OverviewPanel() {
  const [showProductModal, setShowProductModal] = useState(false);
  
  return (
    <div className="flex flex-col gap-5">
      <OverviewHero
        onAddProduct={() => setShowProductModal(true)}
      />
      <OverviewStatsGrid />
      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          onSuccess={(product) => {
            console.log("Product created:", product);
          }}
        />
      )}
    </div>
  );
}