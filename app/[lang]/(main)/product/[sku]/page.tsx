import Container from "@/components/Container";
import { getProductBySku, getProductCategoryRank } from "../services";
import AddToCartButton from "@/module/(main)/cart/components/AddToCartButton";
import { getPriceWithCurrency } from "../utils";
import { Locale } from "../../../../../i18n-config";
import { getDictionary } from "@/lib/utils/dictionary";
import { translate } from "@/lib/utils/serverHelpers";

import SingleProductSlider from "@/components/Slider/SingleProductSlider";
import ProductSlider from "@/components/Slider/ProductSlider";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cookies } from "next/headers";

export default async function ProductPage({
  params,
}: {
  params: { sku: string; lang: Locale };
}) {
  const product = await getProductBySku(params.sku);
  const cookie = await cookies();
  const isVip = cookie.get("isVIP")?.value;
  let productCategoryRank: any = [];
  if (product && product.prod_n_categoryArr) {
    const p = product.prod_n_categoryArr
      .filter((i) => i.category_id && i.rank_id)
      .sort(function (a, b) {
        return a.sorting && b.sorting ? b.sorting - a.sorting : -1;
      });
    if (p.length > 0) {
      productCategoryRank = await getProductCategoryRank(
        p[0].category_id,
        p[0].rank_id
      );
    }
  }
  const dict = await getDictionary(params.lang);
  if (!product) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-danger">
        something went wrong no data found!
      </div>
    );
  }

  const {
    picture,
    name,
    price,
    cart_status,
    availability,
    max_quantity_cart,
    sku,
    wishlist_status,
    categories,
    description,
    variants,
    has_variants,
  } = product;

  // const categoryLinks = categories
  //   ? categories
  //       // to remove any category with name=''
  //       ?.filter((c) => c.name)
  //       .map((cate) => ({
  //         label: cate.name,
  //         link: "/category?id=" + cate.category_id,
  //       }))
  //       //to remove repeated element
  //       .filter(
  //         (value, index, self) =>
  //           index ===
  //           self.findIndex(
  //             (t) => t.label === value.label && t.label === value.label
  //           )
  //       )
  //   : [];

  // const Links = [
  //   ...categoryLinks,
  //   {
  //     label: name,
  //     link: "/",
  //   },
  // ];

  // const mainCategory = categories
  //   ? categories.filter((c) => c.name)[0].name
  //   : "";

  console.log("isvip----=-=-", isVip);
  return (
    <div className="my-10 w-screen">
      <Container>
        {product && (
          <>
            <div>
              {/* <Breadcrumbs items={Links} /> */}
              <div className=" md:grid md:grid-cols-2 gap-6">
                {product && (
                  <SingleProductSlider product={product} isVip={isVip} />
                )}

                <div className="p-4">
                  <h1 className="text-xl md:text-2xl mb-4 font-bold">{name}</h1>
                  <div className="flex justify-between">
                    <span className="font-bold text-secondary text-lg">
                      {isVip && product.vip_price
                        ? getPriceWithCurrency(
                            product.vip_price,
                            translate(dict, "currency")
                          )
                        : getPriceWithCurrency(
                            price,
                            translate(dict, "currency")
                          )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 my-4 gap-4">
                    {/* <div className="bg-gray-100 w-full text-primary font-bold rounded-lg py-2 text-center">
                      {product.}
                    </div> */}
                    {
                      <div
                        className={`${
                          availability ? "text-green-900" : "text-danger"
                        } bg-gray-100  w-full  font-bold rounded-lg py-2 text-center`}
                      >
                        {availability ? "Available" : "Not Available"}
                      </div>
                    }
                  </div>
                  <div className="flex items-start justify-center my-4">
                    <div className="w-full">
                      <AddToCartButton
                        normalBtn
                        sku={sku}
                        cartsStatus={cart_status}
                        isAvailable={availability}
                        maxQantity={max_quantity_cart}
                        hasVariant={has_variants}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-10">
              <ProductSlider
                items={product ? product.related_products : []}
                type="normal"
              />
            </div>
            {/* <div className="">
          <div className="">
            <Image
              className="max-w-full object-cover mx-auto min-w-52 max-h-52"
              src={picture}
              alt={name}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-bold">
              {getPriceWithCurrency(price, translate(dict, "currency"))}
            </span>
            <AddToWishlist sku={sku} isInWhishlist={true} />
          </div>
          <div className="text-lg font-semibold mb-3">{name}</div>
          <div className="flex flex-nowrap overflow-x-auto max-w-full">
            {/* {categories &&
              categories.map((c) => (
                <span
                  key={c.category_id}
                  className="flex-shrink-0 bg-primary-soft text-primary text-xs font-medium mr-2 px-4 py-2 rounded-full"
                >
                  {c.name}
                </span>
              ))} */}
            {/* {isAvailable && (
              <span className="flex-shrink-0 bg-success-soft text-success text-xs font-medium mr-2 px-4 py-2 rounded-full">
                {translate(dict, "available")}
              </span>
            )}
          </div> */}
            {/* {description && (
            <div className="text-gray-400 mb-4">{description}</div>
          )} */}
            {/* <AddToCartButton
            normalBtn
            sku={sku}
            cartsStatus={cart_status}
            isAvailable={availability}
            maxQantity={max_quantity_cart}
            hasVariant={variants && variants.length > 0}
            variants={variants}
          /> */}
            {/* <AddToCartButton
            normalBtn
            sku={sku}
            cartsStatus={cartStatus}
            isAvailable={isAvailable}
            maxQantity={maxQuantityCart}
            hasVariant={hasVariants}
          /> */}
            {/* </div>  */}
          </>
        )}
      </Container>
    </div>
  );
}
