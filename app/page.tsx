import Slider from "@/app/components/Slider/Slider";
import ProductCard from "@/app/components/ProductCard";
import Actions from "@/app/components/Actions";
import NewProducts from "@/app/components/NewProducts";

export default function Home() {
  return (
      <main className="w-full mx-auto mb-20">
        <Slider/>
            <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:mb-25 xl:mb-30">
                <Actions/>
                <NewProducts/>
          </div>
      </main>
  );
}

