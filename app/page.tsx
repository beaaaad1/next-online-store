import Slider from "@/app/components/slider/Slider";
import ProductCard from "@/app/components/ProductCard";
import Actions from "@/app/components/Actions";
import NewProducts from "@/app/components/NewProducts";
import Purchases from "@/app/components/Purchases";
import SpecialOffers from "@/app/components/SpecialOffers";
import Articles from "@/app/components/Articles";

export default function Home() {
  return (
      <main className="w-full mx-auto mb-20">
        <Slider/>
            <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:mb-25 xl:mb-30">
                <Actions/>
                <NewProducts/>
                <Purchases/>
                <SpecialOffers/>
                <Articles/>
          </div>
      </main>
  );
}

