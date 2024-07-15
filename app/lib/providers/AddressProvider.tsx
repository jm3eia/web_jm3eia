"use client";

import React, { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ICity } from "@/module/(main)/city/types";
import {
  IAddAddress,
  IAddAddressResponseResult,
  IAddress,
} from "@/module/(main)/(profile)/types";
import {
  deleteAddresses,
  getAddresses,
  modifyAddresses,
  addAddress as storeAddress,
  updateCity,
} from "@/module/(main)/(profile)/services";
import { IResponse } from "../types";
import { useRouter } from "next/navigation";
import webRoutes from "../utils/webRoutes";

const AddressContext = createContext({
  city: null as ICity | null,
  changeCity: (c: string) => {},
  selectedAddress: null as IAddress | null,
  changeAddress: (a: string) => {},
  addresses: [] as IAddress[],
  addAddress: (
    v: IAddAddress,
    sr: (
      request: Promise<IResponse<IAddAddressResponseResult, IAddAddress>>
    ) => Promise<boolean>
  ): Promise<boolean> => Promise.resolve(false),
  editAddress: (
    id: string,
    v: IAddAddress,
    sr: (
      request: Promise<IResponse<IAddAddressResponseResult, IAddAddress>>
    ) => Promise<boolean>
  ): Promise<boolean> => Promise.resolve(false),
  removeAddress: (
    id: string,
    sr: (
      request: Promise<IResponse<IAddAddressResponseResult, IAddAddress>>
    ) => Promise<boolean>
  ): Promise<boolean> => Promise.resolve(false),
});

const AddressProvider = ({ children }: any) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "addresses",
    "selectedAddress",
    "city",
    "isLoggedIn",
    "data",
    "auth.token",
  ]);

  const [city, setCity] = useState<ICity | null>(cookies["city"]);

  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(
    cookies["selectedAddress"]
  );

  const [addresses, setAddresses] = useState<IAddress[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    cookies["isLoggedIn"] === "true"
  );

  const router = useRouter();

  const options = {
    sameSite: "none",
    secure: true,
    path: "/",
  } as any;

  useEffect(() => {
    setIsLoggedIn(cookies["isLoggedIn"] === "true");
  }, [cookies["isLoggedIn"]]);

  useEffect(() => {
    //if (addresses.length < 1) {
    if (isLoggedIn) {
      getAddresses().then((res) => {
        console.log("GET ADDRESSES LOGS: ", res.results);
        if (res.results) {
          setAddresses(res.results);
          setCookie("addresses", res.results, options);
        }
      });
    } else {
      if (cookies["addresses"]) {
        setAddresses(cookies["addresses"]);
      }
    }
    //}
  }, [isLoggedIn]);

  const changeCity = (cityId: string) => {
    updateCity({ city_id: cityId }).then((res) => {
      if (res.results?.data.city) {
        setCookie(
          "city",
          {
            _id: res.results?.data.city._id,
            name: res.results?.data.city.name,
            store_id: res.results?.data.city.store_id,
            parent_id: res.results?.data.city.parent_id,
          },
          options
        );
        setCity(res.results?.data.city);
      }
    });
  };

  const changeAddress = (addressId: string, newAddresses?: IAddress[]) => {
    const mainAddresses = newAddresses || addresses;
    const foundAddress = mainAddresses.find(
      (address: IAddress) => address.id === addressId
    );
    if (foundAddress) {
      setCookie("selectedAddress", foundAddress, options);
      setSelectedAddress(foundAddress);
      if (foundAddress?.city_id) {
        changeCity(foundAddress.city_id);
      }
      router.replace(webRoutes.home);
    }
  };

  const generateUniqueAddressId = () => {
    const timestamp = Date.now().toString();
    const uniqueId = "address-" + timestamp;

    return uniqueId;
  };

  const addAddress = async (
    values: IAddAddress,
    sendRequest: (
      request: Promise<IResponse<IAddAddressResponseResult, IAddAddress>>
    ) => Promise<boolean>
  ) => {
    if (values.city && values.city.children) delete values.city.children;
    console.log(
      "started...",
      isLoggedIn,
      cookies["isLoggedIn"],
      cookies["isLoggedIn"] === "true"
    );
    if (isLoggedIn && cookies["auth.token"]) {
      const status = await sendRequest(storeAddress(values));
      if (status) {
        const addressesResponse = await getAddresses();
        const newAddresses = addressesResponse.results;
        if (newAddresses && Array.isArray(newAddresses)) {
          setAddresses(newAddresses);
        }
      }
      return status;
    } else {
      console.log("we are here: ", values);
      const newAddress = {
        ...values,
        id: generateUniqueAddressId(),
      } as any;
      const newAddresses: IAddress[] = [
        ...(addresses as IAddress[]),
        newAddress,
      ];
      console.log("new addresses: ", newAddresses);
      setCookie("addresses", newAddresses, options);
      setAddresses(newAddresses);

      if (!selectedAddress) {
        changeAddress(newAddress.id, newAddresses);
      }

      return true;
    }
  };

  const editAddress = async (
    id: string,
    values: IAddAddress,
    sendRequest: (
      request: Promise<IResponse<IAddAddressResponseResult, IAddAddress>>
    ) => Promise<boolean>
  ) => {
    if (isLoggedIn) {
      const status = await sendRequest(modifyAddresses(id, values));
      if (status) {
        const addressesResponse = await getAddresses();
        const newAddresses = addressesResponse.results;
        if (newAddresses && Array.isArray(newAddresses)) {
          setAddresses(newAddresses);
        }
      }
      return status;
    } else {
      const index = addresses.findIndex((a) => a.id == id);
      if (index > -1) {
        const newAddresses: IAddress[] = [...(addresses as IAddress[])];
        newAddresses[index] = values;
        setCookie("addresses", newAddresses, options);
        setAddresses(newAddresses);
      }
      return true;
    }
  };

  const removeAddress = async (
    id: string,
    sendRequest: (
      request: Promise<IResponse<IAddAddressResponseResult, IAddAddress>>
    ) => Promise<boolean>
  ) => {
    if (isLoggedIn) {
      const status = await sendRequest(deleteAddresses(id));
      if (status) {
        const addressesResponse = await getAddresses();
        const newAddresses = addressesResponse.results;
        if (newAddresses && Array.isArray(newAddresses)) {
          setAddresses(newAddresses);
        }
      }
      return status;
    } else {
      const newAddresses: IAddress[] = [
        ...addresses.filter((a) => a && a.id !== id),
      ];
      setCookie("addresses", newAddresses, options);
      setAddresses(newAddresses);

      if (selectedAddress?.id && id !== selectedAddress?.id) {
        changeAddress(selectedAddress?.id, newAddresses);
      }

      if (id == selectedAddress?.id) {
        setSelectedAddress(null);
        setCookie("selectedAddress", null, options);
      }
    }
    return true;
  };

  return (
    <AddressContext.Provider
      value={{
        addAddress,
        addresses,
        changeAddress,
        changeCity,
        city,
        selectedAddress,
        editAddress,
        removeAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export { AddressProvider, AddressContext };
