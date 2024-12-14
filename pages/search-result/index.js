/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { searchProductsByName } from "@/feature/search-products";
import CardBook from "@/components/card-book";

export default function SearchResult() {
  const router = useRouter();
  const { query } = router.query; // Lấy từ khóa từ URL
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        const results = await searchProductsByName(query);
        // Lọc ra những sản phẩm có `visible` là `true`
        const visibleResults = results.filter((product) => product.visible);
        setSearchResults(visibleResults);
      };
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen">
      <div className="container m-auto mt-4 p-10">
        <h2 className="font-bold text-3xl flex items-center tracking-[2px] oswald line-space my-8">
          <div className="h-[77px] icon-avatar"></div>
          <span className="relative pl-2 bg-white">Kết quả tìm kiếm cho "{query}"</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <CardBook
                key={product.id}
                id={product.id}
                name={product.name}
                img={product.img}
                price={product.price}
                description={product.description}
                visible={product.visible}
                mota={product.mota || ""}
                categories={product.categories || []}
                path={product.path || ""}
              />
            ))
          ) : (
            <p>Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
