"use client";

import { CODIcon, KnetIcon } from "@/components/Icons";
import { IPaymentMethod } from "../types";

interface IPaymentMethodsProps {
  payment_methods: IPaymentMethod[];
  dictionary: {
    payment_methods: string;
    knet: string;
    cod: string;
  };
  onSelect: (v: IPaymentMethod) => void;
  selectedPaymentMethod: string;
}

export default function PaymentMethods({
  onSelect,
  payment_methods,
  dictionary,
  selectedPaymentMethod,
}: IPaymentMethodsProps) {
  return (
    <div className="w-full">
      <h5 className="text-xl mb-2 text-secondary font-bold text-center">
        {dictionary.payment_methods}
      </h5>

      <div className="flex flex-col bg-white rounded-2xl px-4 mb-3">
        {payment_methods.map((pm, i) => (
          <div key={i}>
            {pm.id === "cod" && (
              <div key={pm.id} className="flex items-center pl-4 border-b">
                <input
                  id="cod"
                  type="radio"
                  value="cod"
                  name="payment_method"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={selectedPaymentMethod === pm.id}
                  onChange={() => onSelect(pm)}
                />
                <label
                  htmlFor="cod"
                  className="flex text-base  items-center gap-2 w-full py-4 ml-2 font-semibold text-gray-900"
                >
                  <CODIcon />
                  {dictionary.cod}
                </label>
              </div>
            )}

            {pm.id === "knet" && (
              <div key={pm.id} className="flex items-center pl-4">
                <input
                  id="knet"
                  type="radio"
                  value="knet"
                  name="payment_method"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={selectedPaymentMethod === pm.id}
                  onChange={() => onSelect(pm)}
                />
                <label
                  htmlFor="knet"
                  className="flex items-center gap-2 w-full py-4 ml-2 text-base  font-semibold text-gray-900"
                >
                  <KnetIcon />
                  {dictionary.knet}
                </label>
              </div>
            )}
          </div>
        ))}
        {/* <div className="flex items-center pl-4 border-b">
          <input
            id="visa"
            type="radio"
            value="visa"
            name="payment_method"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            checked={selectedPaymentMethod === "visa"}
            onChange={() => onSelect({ id: "visa", name: "visa", valid: true })}
          />
          <label
            htmlFor="visa"
            className="flex items-center gap-2 w-full py-4 ml-2 text-sm font-medium text-gray-900"
          >
            VISA
          </label>
        </div> */}
      </div>
    </div>
  );
}
