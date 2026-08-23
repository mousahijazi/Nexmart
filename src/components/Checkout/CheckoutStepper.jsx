import { StepCircle } from "@/index";

export default function CheckoutStepper({isAddress}) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <StepCircle 
            stepNumber={1} 
            label="Address" 
            isActive={isAddress} 
        />
        <div className="w-16 h-0.5 bg-[var(--color-border)] dark:bg-[var(--color-border)] mb-5" />
        <StepCircle 
            stepNumber={2} 
            label="Pay" 
            isActive={!isAddress} 
        />
    </div>
  )
}
