export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="relative flex justify-center items-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        
        {/* Inner logo/text */}
        <div className="absolute font-bold text-primary text-xl font-heading">
          P<span className="text-accent">+</span>
        </div>
      </div>
      <p className="text-muted-foreground font-medium mt-6 animate-pulse">Memuat data...</p>
    </div>
  );
}
