"use client";
//@ts-expect-error
import { useFormState } from "react-dom";
import { ComboboxItem, Select } from "@mantine/core";
import { ICity } from "@/module/(main)/city/types";
import React, { useContext, useEffect, useState } from "react";
import useHttpClient from "@/lib/hooks/useHttpClient";
import Button from "../../../(main)/(profile)/account/components/Button";
import { updateCity } from "@/module/(main)/(profile)/services";
import {
  IUpdateCity,
  IUpdateCityResponseResult,
} from "@/module/(main)/(profile)/types";
import { useRouter } from "next/navigation";
import { SetGuestCityId } from "@/lib/server actions/setGuestCity";
import { AddressContext } from "@/lib/providers/AddressProvider";
import { useCookies } from "react-cookie";
import { AuthContext } from "@/lib/providers/AuthProvider";
import webRoutes from "@/lib/utils/webRoutes";

interface Props {
  cities: ICity;
  buttonLabel: string;
}
export default function ChooseCity({ cities, buttonLabel }: Props) {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [selectCity, setSelectCity] = useState<ComboboxItem | null>(null);
  const { changeCity, city } = useContext(AddressContext);
  const {
    isLoading,
    errors: validationErrors,
    results,
    sendRequest,
  } = useHttpClient<IUpdateCityResponseResult, IUpdateCity>();
  const { translate } = useContext(AuthContext);
  const router = useRouter();
  const [state, formAction] = useFormState(SetGuestCityId, { city_id: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "city",
    "city_id",
    "addresses",
    "selectedAddress",
  ]);

  const citiesData =
    cities && cities.children && cities.children.length > 0
      ? cities.children.map((c) => ({ label: c.name as string, value: c._id }))
      : [];

  const handleGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectCity?.value) {
      setLoading(true);
      //const status = await sendRequest(changeCity(selectCity.value));
      const status =
        //   // await sendRequest(
        await updateCity({ city_id: selectCity.value });
      // //);
      console.log("status update city", status);

      // console.log(status);
      // console.log("results", results);
      // if (city) {
      //   // router.push("/");
      // }
      setLoading(false);
      const options = {
        sameSite: "none",
        secure: true,
        path: "/",
      } as any;

      // setCookie("city_id", selectCity?.value, options);
      setCookie(
        "addresses",
        {
          city_id: selectCity?.value,
          widget: "1",
          street: "1",
          gada: "1",
          house: "10",
          floor: "1",
          apartment_number: "1",
          latitude: "29.32514313374099",
          longitude: "47.678556769644985",
        },
        options
      );
      setCookie(
        "selectedAddress",
        {
          city_id: selectCity?.value,
          widget: "1",
          street: "1",
          gada: "1",
          house: "10",
          floor: "1",
          apartment_number: "1",
          latitude: "29.32514313374099",
          longitude: "47.678556769644985",
        },
        options
      );
      // setCity(res.results?.data.city);
      // router.push(webRoutes.home);
      if (window) window.location.href = webRoutes.home;
    }
  };
  return (
    <div className="w-full">
      {isGuest ? (
        citiesData && (
          //   <form action={formAction}>
          <form onSubmit={(e) => handleGuest(e)}>
            <Select
              data={citiesData}
              value={selectCity?.value || null}
              name="city_id"
              id="city_id"
              placeholder={translate("choose_city")}
              onChange={(_value, option) => setSelectCity(option)}
              classNames={{
                root: "w-full",
                dropdown: "bg-white",
                input: "focus:!border-primary px-4",
              }}
            />
            {/* <select
              onChange={(e) => setSelectCity(e.target.value)}
              name="city_id"
              className="w-full"
            >
              {cities &&
                cities.children &&
                cities.children.map((city) => (
                  <option value={city._id} key={city._id}>
                    {city.name as string}
                  </option>
                ))}
            </select> */}
            <Button
              title="Continue"
              className="w-full !bg-primary !text-white my-4"
              type="submit"
              isLoading={loading}
            />
          </form>
        )
      ) : (
        <div className="text-center">
          <button
            onClick={() => setIsGuest(true)}
            className="text-lg font-bold text-secondary"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
