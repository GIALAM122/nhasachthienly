import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";
import CardBook from "@/components/card-book";
import { useRef } from "react";

const RelatedProductsSlider = ({ products }) => {
  const slickRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="mt-12 relative">
      <h3 className="text-3xl font-bold uppercase mb-6">Có thể bạn cũng thích</h3>

      {/* Nút điều hướng */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          className="transform -translate-y-[50%] w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-cyan-500 text-white rounded-md transition-colors"
          onClick={() => slickRef.current.slickPrev()}
        >
          <GrPrevious />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          className="transform -translate-y-[50%] w-10 h-10 flex items-center justify-center bg-gray-300 hover:bg-cyan-500 text-white rounded-md transition-colors"
          onClick={() => slickRef.current.slickNext()}
        >
          <GrNext />
        </button>
      </div>
      

      {/* Slider */}
      <Slider ref={slickRef} {...settings}>
        {products.filter((item) => item.visible).map((item) => (
          <div key={item.id}>
            <CardBook {...item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProductsSlider;
