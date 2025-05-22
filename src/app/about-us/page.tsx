import ProductPage from "@/components/ProductPage";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center mt-12">
        <ProductPage className="mb-20">
          <h2 className="font-cinzel text-4xl mb-4 font-bold">About Us</h2>
          <p className="font-roboto text-lg mb-4">
          At Oak and Clay, we believe timber framing is more than a construction method—it’s a craft 
          that connects people to the timeless beauty of natural wood and the joy of building something 
          enduring. Our mission is to make this craft accessible to everyone, from DIY enthusiasts to 
          seasoned general contractors, by offering precision-engineered timber frame kits and custom, 
          handcrafted frames that embody quality, simplicity, and sustainability.
          </p>
          <p className="font-roboto text-lg mb-4">
          Our Douglas Fir and Yellow Cedar timber frame kits are designed for builders of all levels. 
          Precision-cut using state-of-the-art CNC milling, each kit arrives complete with everything 
          you need for a seamless assembly process—no specialized skills required. Affordable and thoughtfully 
          engineered, these kits empower you to create a sturdy, beautiful structure, whether it’s a 
          cozy cottage, a relaxing sauna, a practical shed, an elegant pavilion, or a spacious barn.
          </p>
          <p className="font-roboto text-lg mb-4">
          For those envisioning a one-of-a-kind project, our bespoke timber frames elevate craftsmanship 
          to an art form. We source premium hard and soft woods from sustainable, regional suppliers, 
          ensuring every piece reflects quality and purpose. Our skilled artisans use traditional joinery 
          techniques, blending time-honored methods with modern precision to craft frames tailored to 
          your vision. From custom homes to unique architectural features, we deliver structures that 
          are as distinctive as they are durable.
          </p>
          <p className="font-roboto text-lg mb-4">
          Rooted in a passion for quality and a commitment to sustainability, Oak and Clay is here to 
          support your journey. Whether you’re picking up a hammer for the first time or crafting a 
          legacy project, we’re with you every step of the way, providing expertise, inspiration, and 
          materials you can trust. Let’s build something extraordinary together.
          </p>
        </ProductPage>
    </div>
  );
}