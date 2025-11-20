import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { RoastMasterSection } from "./components/RoastMasterSection";
import { ExoticCoffees } from "./components/ExoticCoffees";
import { ProducerSpotlight } from "./components/ProducerSpotlight";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      <RoastMasterSection />
      <ExoticCoffees />
      <ProducerSpotlight />
      
      <footer className="bg-black text-white py-16 border-t border-orange-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
            <div>
              <h3 className="text-xl mb-4">Andy's Roaster Co.</h3>
              <p className="text-sm text-neutral-400">
                Specialty coffee roastery in Hanoi, Vietnam. Roasted by Dinh Phong, 
                showcasing exceptional single-origin coffees from around the world.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 text-orange-500">Shop</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">All Coffees</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Subscriptions</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Equipment</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Merchandise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-orange-500">Learn</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Brewing Guides</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Our Roasting Process</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Producer Stories</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-orange-500">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Visit Our Café</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Wholesale</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
            <p>© 2025 Andy's Roaster Co. All rights reserved.</p>
            <p className="mt-4 md:mt-0">📍 Hanoi, Vietnam | Roasted by Dinh Phong</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
