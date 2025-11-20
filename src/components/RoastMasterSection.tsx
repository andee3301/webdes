import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Coffee, Flame } from "lucide-react";

export function RoastMasterSection() {
  return (
    <section id="roastmaster" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
            <h2 className="text-5xl md:text-6xl mb-4">Meet the Roast Master</h2>
            <p className="text-lg text-neutral-600">The artisan behind every batch</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div className="relative">
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1572232055034-ef36b5d31364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNTAwNzYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Dinh Phong - Head Roaster"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h3 className="text-3xl text-white mb-2">Dinh Phong</h3>
                  <p className="text-orange-500 text-lg">Head Roaster & Founder</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl mb-4">A Journey Through Coffee</h3>
                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    Dinh Phong's passion for coffee began over 15 years ago in the highlands of Vietnam, 
                    where he first learned the intricacies of coffee cultivation and processing from local farmers.
                  </p>
                  
                  <p>
                    After years of studying roasting techniques across Asia, Europe, and the Americas, 
                    Dinh returned to Hanoi to establish Andy's Roaster Co. in 2018. His philosophy centers 
                    on respecting the origin story of each bean and unlocking its unique character through 
                    precise roasting.
                  </p>
                  
                  <p>
                    Today, Dinh personally oversees every roast, ensuring each batch meets his exacting 
                    standards. His approach combines traditional Vietnamese coffee culture with modern 
                    specialty coffee techniques, creating a bridge between old and new.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coffee className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-2xl mb-1">15+</p>
                  <p className="text-sm text-neutral-600">Years Experience</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-2xl mb-1">50k+</p>
                  <p className="text-sm text-neutral-600">Batches Roasted</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-2xl mb-1">12</p>
                  <p className="text-sm text-neutral-600">Awards Won</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-8 md:p-12 rounded-lg">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-2xl md:text-3xl mb-4 italic">
                "Every coffee has a story. My role is to honor that story through the roast, 
                bringing out the best qualities that the farmer and the land have created."
              </p>
              <p className="text-orange-500">— Dinh Phong</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
