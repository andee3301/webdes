import { Button } from "./ui/button";

export function OriginShowcase() {
  const origins = [
    {
      name: "ETHIOPIA",
      description: "The birthplace of coffee. Heirloom varieties from Yirgacheffe and Sidamo deliver complex florals, bright acidity, and fruit-forward profiles.",
      image: "https://images.unsplash.com/photo-1633275858168-d53d224b2a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhpb3BpYSUyMGNvZmZlZSUyMGJlYW5zfGVufDF8fHx8MTc2MjUwMDc2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "COLOMBIA",
      description: "Renowned for consistency and balance. High-altitude farms across Huila and Antioquia produce clean, sweet coffees with vibrant acidity.",
      image: "https://images.unsplash.com/photo-1756121422046-8a3638d75efb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGNvZmZlZSUyMGNoZXJyaWVzfGVufDF8fHx8MTc2MjUwMDc2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "VIETNAM",
      description: "The world's second-largest producer. From bold Robusta in the Central Highlands to delicate Arabica in Đà Lạt's cool mountains.",
      image: "https://images.unsplash.com/photo-1663125365422-dab15325277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwY29mZmZlZSUyMGZhcm18ZW58MXx8fHwxNzYyNDk5NzQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <section id="origins" className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl mb-6" style={{ 
            fontFamily: 'serif',
            fontWeight: 400,
            letterSpacing: '0.05em'
          }}>
            Coffee<br/>Origins
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
            We source from the world's most renowned coffee-growing regions, 
            building direct relationships with farmers who share our commitment to quality.
          </p>
          <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
            VIEW ALL ORIGINS
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {origins.map((origin, index) => (
            <div key={origin.name} className="group cursor-pointer">
              <div className="relative h-[500px] rounded-t-full overflow-hidden mb-6">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${origin.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <h3 className="text-3xl tracking-wider mb-2">{origin.name}</h3>
                  <div className="w-12 h-1 bg-orange-600 mx-auto"></div>
                </div>
              </div>
              <p className="text-sm text-neutral-400 text-center leading-relaxed px-4">
                {origin.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
