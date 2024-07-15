import Container from "@/components/Container";
import { AccountIcon, ChevronRight } from "@/components/Icons";
import Navbar from "@/components/Navbar";
import apiHandler from "@/lib/utils/apiHandler";
import webRoutes from "@/lib/utils/webRoutes";
import Link from "next/link";
import { IUser } from "../types";
import { Locale } from "../../../../../i18n-config";
import { getDictionary } from "@/lib/utils/dictionary";
import { translate } from "@/lib/utils/serverHelpers";
import { LockClosedIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import DeleteAccount from "./components/DeleteAccount";
import SharedLayout from "../components/SharedLayout";
import Button from "./components/Button";
import GoogleMaps from "../addresses/components/Map";

export default async function Account({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const user: IUser = await apiHandler(
    "/profile",
    "GET",
    undefined,
    true,
    false
  );
  const dict = await getDictionary(lang);
  return (
    <div>
      <SharedLayout dict={dict} user={user} title="My Account">
        {/* profile details */}
        <div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center mb-4">
            <span className="text-bold col-span-1 text-sm md:text-base  lg:text-lg">
              {translate(dict, dict.email)}
            </span>
            <div className="col-span-3 md:col-span-5 lg:col-span-7 bg-slate-100 w-full px-4 py-2 rounded-lg">
              {user.email}
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center mb-4">
            <span className="text-bold col-span-1 text-sm  md:text-base  lg:text-lg">
              {translate(dict, dict.fullname)}
            </span>
            <div className="col-span-3 md:col-span-5 lg:col-span-7 bg-slate-100 w-full px-4 py-2 rounded-lg">
              {user.fullname}
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center mb-4">
            <span className="text-bold col-span-1 text-sm  md:text-base  lg:text-lg">
              {translate(dict, dict.username)}
            </span>
            <div className="col-span-3 md:col-span-5 lg:col-span-7 bg-slate-100 w-full px-4 py-2 rounded-lg">
              {user.username}
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center mb-4">
            <span className="text-bold col-span-1 text-sm  md:text-base  lg:text-lg">
              {translate(dict, "phone")}
            </span>
            <div className="col-span-3 md:col-span-5 lg:col-span-7 bg-slate-100 w-full px-4 py-2 rounded-lg">
              {user.mobile}
            </div>
          </div>
          {/* buttons */}
          <div className="w-full lg:px-4 lg:w-3/5">
            <div className="text-center my-8">
              <Link href={webRoutes.updateProfile}>
                <Button title="Update" />
              </Link>
            </div>
            <div className="flex items-center justify-between ">
              <Link href={webRoutes.updateEmail}>
                <Button title="change email" />
              </Link>
              <Link href={webRoutes.updatePassword}>
                <Button title="Change Password" />
              </Link>
            </div>
          </div>
        </div>
      </SharedLayout>
    </div>
  );
}
