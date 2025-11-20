import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1663125365422-dab15325277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwY29mZmVlJTIwZmFybXxlbnwxfHx8fDE3NjI0OTk3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
            Exceptional coffees from around the world
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Expertly roasted by Dinh Phong in Hanoi, Vietnam. Discover single-origin coffees 
            sourced from the finest farms across the globe.
          </p>
          <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700">
            Explore Our Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
