import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ProducerSpotlight() {
  return (
    <section id="farms" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1596205996037-fefbc59a90cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29mZmVlJTIwcGxhbnRhdGlvbnxlbnwxfHx8fDE3NjI0OTk3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Vietnamese Coffee Producer"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="w-16 h-1 bg-orange-600 mb-4"></div>
              <h2 className="text-5xl md:text-6xl mb-2">
                Trần Văn Minh
              </h2>
              <p className="text-lg text-orange-500">Producer Spotlight</p>
            </div>
            
            <div className="space-y-4 text-neutral-300">
              <p>
                Trần Văn Minh is a third-generation coffee farmer whose family has cultivated arabica 
                in the Đà Lạt highlands for over 60 years. His commitment to sustainable farming 
                practices and meticulous processing has made him one of Vietnam's most respected producers.
              </p>
              
              <p>
                Working at elevations between 1,400-1,600 meters, Minh's farm produces exceptional 
                Catimor and Typica varieties that showcase the unique terroir of the Central Highlands. 
                His attention to cherry selection and controlled fermentation creates coffees with 
                remarkable clarity and sweetness.
              </p>
              
              <p>
                In 2024, his micro-lot won first place at the Vietnam Coffee Excellence competition, 
                solidifying his position as one of the country's elite producers.
              </p>
            </div>
            
            <Button className="bg-orange-600 text-white hover:bg-orange-700">
              EXPLORE HIS COFFEES
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
