"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatCurrency } from "@/lib/utils";

const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
  const [currency, setCurrency] = useState("usd");
  const [amount, setAmount] = useState("1");

  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0);

  return (
    <div id="converter">
      <h4 className="text-gray-50">{symbol.toUpperCase()} Converter</h4>

      <div className="panel">
        <div className="input-wrapper">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAmount(e?.target?.value)
            }
            className="input text-gray-200"
          />
          <div className="coin-info">
            <Image src={icon} alt={symbol} width={20} height={20} />
            <p>{symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="divider">
          <div className="line" />

          <Image
            src="/converter.svg"
            alt="converter"
            width={32}
            height={32}
            className="icon"
          />
        </div>

        <div className="output-wrapper">
          <p className="text-gray-200">
            {formatCurrency(convertedPrice, 2, currency, false)}
          </p>

          <Select
            value={currency}
            onValueChange={(e) => setCurrency(e as string)}
          >
            <SelectTrigger className="select-trigger" value={currency}>
              <SelectValue placeholder="Select" className="select-value">
                {currency.toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="select-content" data-converter>
              {Object.keys(priceList).map((currencyCode) => (
                <SelectItem
                  value={currencyCode}
                  key={currencyCode}
                  className="select-item"
                >
                  {currencyCode.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
export default Converter;
