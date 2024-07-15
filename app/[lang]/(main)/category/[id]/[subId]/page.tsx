import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import ProductCard from "@/module/(main)/product/components/ProductCard";
import {
  getCategoryById,
  getCategoryProducts,
  getRanksByCategoryId,
} from "../../services";
import SubCategoriesList from "@/module/(main)/category/components/Categories/SubCategoriesList";
import { Locale } from "../../../../../../i18n-config";
import { getDictionary } from "@/lib/utils/dictionary";
import { translate } from "@/lib/utils/serverHelpers";
import { cookies } from "next/headers";

export default async function SubCategoriesPage({
  params,
  searchParams: { supplier },
}: {
  params: { id: string; subId: string; lang: Locale };
  searchParams: { supplier: string };
}) {
  const category = await getCategoryById(params.id);

  const ranks = await getRanksByCategoryId(params.subId);

  const products = await getCategoryProducts(params.subId);

  const dict = await getDictionary(params.lang);

  const cookie = cookies();
  const isVip = cookie.get("isVIP")?.value;
  return (
    <>
      <Navbar supplierId={supplier} title={category.name} />
      <Container>
        <div>
          {/* @ts-expect-error Server Component */}
          <SubCategoriesList
            id={params.id}
            subId={params.subId}
            category={category}
          />
          <div className="py-4">
            <div>
              <div className="flex gap-3 mb-4">
                {ranks &&
                  ranks.data &&
                  ranks.data.map(({ _id, name }) => (
                    <a
                      key={_id}
                      href={`#${_id}`}
                      className="bg-primary-soft text-sm  rounded-full py-1 w-full !text-primary text-center"
                    >
                      {name}
                    </a>
                  ))}
              </div>
              {ranks &&
                ranks.data &&
                ranks.data.map(({ _id, name }) => (
                  <div key={_id} id={_id}>
                    <div className="bg-white shadow-sm w-fit text-sm px-2 py-1 rounded-full mb-3 mx-auto text-primary">
                      {name}
                    </div>

                    <div className="grid md:grid-cols-4 grid-cols-2 gap-2 items-stretch">
                      {products
                        ? products.data
                            .filter(
                              ({ prod_n_categoryArr }) =>
                                prod_n_categoryArr.findIndex(
                                  (c) => c.rank_id && c.rank_id === _id
                                ) > -1
                            )
                            .map((product) => (
                              <ProductCard
                                key={product.sku}
                                product={product}
                              />
                            ))
                        : "No results"}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
