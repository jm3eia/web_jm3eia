"use client";
import Loader from "@/components/Loader";
import { getCategories } from "@/module/(main)/category/services";
import webRoutes from "@/lib/utils/webRoutes";
import { categories } from "../../../../../../dummyData";
import MainSlider from "@/components/Slider";

import { getInventories } from "../../services";
import Link from "next/link";
import Image from "next/image";
import { BsArrowRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IInventory, ISupp, ISupplierResults } from "../../types";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  supplierFeature?: ISupplierResults;
}
export default function SuppliersClient({ supplierFeature }: Props) {
  const path = usePathname();
  const storePage = path.includes("/stores");

  return (
    <div className="my-2 pb-2 md:my-4 md:pb-3 lg:my-6 lg:pb-4">
      {supplierFeature && (
        <h3
          className={`${
            storePage
              ? "text-black bg-[#EEEEEE] rounded-full p-1 md:p-2"
              : "text-secondary mb-2 md:pb-4"
          } text-[16px] md:text-[18px] lg:text-[20px] font-bold  my-4  px-10 w-fit`}
        >
          {supplierFeature.name}
        </h3>
      )}
      <MainSlider
        // lgSize={stores.length > 5 ? 5 : stores.length}
        // mdSize={stores.length > 4 ? 4 : stores.length}
        // xlSize={stores.length > 6 ? 6 : stores.length}
        // smSize={stores.length > 3 ? 3 : stores.length}
        lgSize={5}
        mdSize={4}
        xlSize={6}
        smSize={3}
        nextIcon={BsChevronRight}
        prevIcon={BsChevronLeft}
      >
        {supplierFeature &&
          supplierFeature.suppliers.map((supplier, i) => (
            <div key={i} className=" flex justify-center">
              <Link
                href={"/stores/" + supplier._id}
                className="block relative w-24 h-24 md:w-28 md:h-28 lg:w-40 lg:h-40"
              >
                <Image
                  src={supplier.logo}
                  // width={storePage ? 150 : 130}
                  // height={storePage ? 150 : 130}
                  fill
                  className="rounded shadow-md p-1"
                  alt={"supplier"}
                />
              </Link>
            </div>
          ))}
      </MainSlider>
    </div>
  );
}
