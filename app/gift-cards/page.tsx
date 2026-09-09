"use client";

import { Drawer } from "vaul";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  Globe2,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PinModal } from "@/components/PinModal";
import { useAuthGate } from "@/hooks/useAuthGate";
import { countries } from "@/lib/mock-data/countries";
import { getExchangeRate } from "@/lib/mock-data/exchange-rates";
import { giftCardBrandOptions } from "@/lib/mock-data/gift-card-brands";
import {
  translations,
  usePreferences,
} from "@/lib/context/preferences-context";

export default function GiftCardsPage() {
  const { language } = usePreferences();
  const labels = translations[language];
  const [buyIndex, setBuyIndex] = useState(0);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("NG");
  const [selectedBrandId, setSelectedBrandId] = useState("ng-amazon");
  const [localCurrency, setLocalCurrency] = useState<
    "NGN" | "USD" | "GBP" | "EUR"
  >("NGN");
  const [sellDenomination, setSellDenomination] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [feeOpen, setFeeOpen] = useState(true);
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const authGate = useAuthGate();

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.currency.toLowerCase().includes(query),
    );
  }, [countrySearch]);

  const selectedCountry =
    countries.find((country) => country.code === selectedCountryCode) ??
    countries[0];

  const countryBrands = useMemo(
    () =>
      giftCardBrandOptions.filter(
        (brand) => brand.countryCode === selectedCountry.code,
      ),
    [selectedCountry.code],
  );

  const selectedBrand =
    countryBrands.find((brand) => brand.id === selectedBrandId) ??
    countryBrands[0];

  const activeBrand =
    giftCardBrandOptions[buyIndex % giftCardBrandOptions.length];

  const exchangeInfo = useMemo(() => {
    const conversion = getExchangeRate(selectedCountry.currency, localCurrency);
    const grossValue = sellDenomination * conversion.rate;
    const serviceFee = grossValue * conversion.feePercent;
    const finalPayout = grossValue - serviceFee;

    return {
      conversion,
      grossValue,
      serviceFee,
      finalPayout,
    };
  }, [localCurrency, selectedCountry.currency, sellDenomination]);

  const changeBrand = (direction: -1 | 1) => {
    setBuyIndex(
      (index) =>
        (index + direction + giftCardBrandOptions.length) %
        giftCardBrandOptions.length,
    );
  };

  const submitCard = () => {
    authGate(() => {
      setPinOpen(true);
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Gift cards</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {labels.giftTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse cards, compare rates, and estimate a payout in your local
          currency.
        </p>
      </header>

      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#c45a3c] to-[#e07a5f] p-5 text-white shadow-[0_4px_24px_rgba(224,122,95,0.25)] md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/65">
              Buy side
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">
              Discover brands
            </h2>
          </div>
          <Gift className="size-6 text-orange-300" />
        </div>

        <div className="relative mt-8 flex items-center justify-center gap-3 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => changeBrand(-1)}
            className="shrink-0 text-white hover:bg-white/10 hover:text-white"
            aria-label="Previous gift card"
          >
            <ArrowLeft />
          </Button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-3 md:gap-5">
            {[...giftCardBrandOptions, ...giftCardBrandOptions]
              .slice(buyIndex, buyIndex + 3)
              .map((brand, index) => {
                const realIndex =
                  (buyIndex + index) % giftCardBrandOptions.length;
                const isActive = realIndex === buyIndex;

                return (
                  <motion.button
                    key={`${brand.name}-${index}`}
                    type="button"
                    onClick={() => setBuyIndex(realIndex)}
                    animate={{
                      scale: isActive ? 1 : 0.86,
                      opacity: isActive ? 1 : 0.5,
                      rotateY: isActive ? 0 : index === 0 ? 18 : -18,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className={`hidden aspect-[1.55/1] w-full max-w-[230px] shrink-0 flex-col justify-between rounded-2xl border p-5 text-left shadow-2xl first:flex sm:flex ${isActive ? "border-white/40" : "border-white/10"}`}
                    style={{ backgroundColor: brand.color }}
                  >
                    <span className="text-xs uppercase tracking-[0.16em] text-white/65">
                      {brand.category}
                    </span>
                    <span className="font-heading text-xl font-semibold text-white">
                      {brand.name}
                    </span>
                    <span className="text-xs text-white/65">{brand.value}</span>
                  </motion.button>
                );
              })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => changeBrand(1)}
            className="shrink-0 text-white hover:bg-white/10 hover:text-white"
            aria-label="Next gift card"
          >
            <ArrowRight />
          </Button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <span className="text-sm text-blue-100/70">Selected brand</span>
          <span className="font-medium text-white">
            {activeBrand.name} · {activeBrand.category}
          </span>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-border bg-card p-5 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Sell side
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Sell a Gift Card
              </h2>
            </div>
            <Globe2 className="size-6 text-primary" />
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Country
              </p>
              <div className="mt-2 hidden sm:block">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={countrySearch}
                    onChange={(event) => setCountrySearch(event.target.value)}
                    placeholder="Search country"
                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => setSelectedCountryCode(country.code)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${selectedCountryCode === country.code ? "border-primary bg-secondary text-primary" : "border-border hover:border-primary/35"}`}
                    >
                      <span>{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 sm:hidden">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setCountrySheetOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.name}</span>
                  </span>
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Brand</p>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {countryBrands.map((brand) => (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setSelectedBrandId(brand.id)}
                    className={`rounded-2xl border p-3 text-left transition-colors ${selectedBrandId === brand.id ? "border-primary bg-secondary" : "border-border bg-background hover:border-primary/35"}`}
                    style={{
                      boxShadow:
                        selectedBrandId === brand.id
                          ? `0 0 0 3px ${brand.color}22`
                          : undefined,
                    }}
                  >
                    <span
                      className="mb-3 flex size-9 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: brand.color }}
                    >
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                    <p className="font-medium">{brand.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {brand.category}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Card details
              </p>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  setFileName(event.dataTransfer.files[0]?.name ?? "");
                }}
                className={`mt-3 rounded-[22px] border-2 border-dashed p-5 transition-colors ${isDragging ? "border-primary bg-secondary/70" : "border-border bg-muted/35"}`}
              >
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center text-center">
                  <Upload className="size-7 text-muted-foreground" />
                  <span className="mt-3 text-sm font-medium">
                    {fileName || "Drop card image here"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Receipt, front card, or screenshot
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) =>
                      setFileName(event.target.files?.[0]?.name ?? "")
                    }
                  />
                </label>
              </div>

              <label
                className="mt-5 block text-sm font-medium"
                htmlFor="sell-denomination"
              >
                Denomination
                <span className="relative mt-2 block">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {selectedCountry.currency === "NGN"
                      ? "₦"
                      : selectedCountry.currency === "USD"
                        ? "$"
                        : selectedCountry.currency === "GBP"
                          ? "£"
                          : "€"}
                  </span>
                  <input
                    id="sell-denomination"
                    type="number"
                    min="0"
                    value={sellDenomination}
                    onChange={(event) =>
                      setSellDenomination(Number(event.target.value) || 0)
                    }
                    className="h-12 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-lg outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                  />
                </span>
              </label>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-border bg-card p-6 md:p-8">
          <p className="text-sm font-medium text-muted-foreground">
            Live conversion
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">
            Estimated payout
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {(["NGN", "USD", "GBP", "EUR"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocalCurrency(code)}
                className={`rounded-xl border px-2.5 py-2 text-xs font-medium transition-colors ${localCurrency === code ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                {code}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-border bg-muted/35 p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Final payout</span>
              <span className="text-xs uppercase tracking-[0.16em]">
                {localCurrency}
              </span>
            </div>

            <motion.div
              key={`${selectedCountry.currency}-${localCurrency}-${exchangeInfo.finalPayout}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-end justify-between gap-3"
            >
              <span className="font-heading text-3xl font-semibold text-success">
                {localCurrency === "NGN"
                  ? "₦"
                  : localCurrency === "USD"
                    ? "$"
                    : localCurrency === "GBP"
                      ? "£"
                      : "€"}
                {exchangeInfo.finalPayout.toLocaleString(
                  localCurrency === "NGN" ? "en-NG" : undefined,
                  { maximumFractionDigits: localCurrency === "NGN" ? 0 : 2 },
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedBrand?.name}
              </span>
            </motion.div>
          </div>

          <div className="mt-5 border-y border-border py-3">
            <button
              type="button"
              onClick={() => setFeeOpen((open) => !open)}
              className="flex w-full items-center justify-between text-sm text-muted-foreground"
            >
              <span>Breakdown</span>
              <ChevronDown
                className={`size-4 transition-transform ${feeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {feeOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Face value</span>
                    <span>
                      {selectedCountry.currency === "NGN"
                        ? "₦"
                        : selectedCountry.currency === "USD"
                          ? "$"
                          : selectedCountry.currency === "GBP"
                            ? "£"
                            : "€"}
                      {sellDenomination.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Rate applied</span>
                    <span>
                      {exchangeInfo.conversion.rate.toFixed(2)}{" "}
                      {selectedCountry.currency} → {localCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Service fee</span>
                    <span>
                      {localCurrency === "NGN"
                        ? "₦"
                        : localCurrency === "USD"
                          ? "$"
                          : localCurrency === "GBP"
                            ? "£"
                            : "€"}
                      {exchangeInfo.serviceFee.toLocaleString(
                        localCurrency === "NGN" ? "en-NG" : undefined,
                        {
                          maximumFractionDigits:
                            localCurrency === "NGN" ? 0 : 2,
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Final payout</span>
                    <span className="text-foreground">
                      {localCurrency === "NGN"
                        ? "₦"
                        : localCurrency === "USD"
                          ? "$"
                          : localCurrency === "GBP"
                            ? "£"
                            : "€"}
                      {exchangeInfo.finalPayout.toLocaleString(
                        localCurrency === "NGN" ? "en-NG" : undefined,
                        {
                          maximumFractionDigits:
                            localCurrency === "NGN" ? 0 : 2,
                        },
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <Button
            type="button"
            onClick={submitCard}
            disabled={!fileName || !selectedBrand}
            className="mt-6 h-12 w-full"
          >
            Sell now
          </Button>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-success/20 bg-success/10 p-3 text-sm text-success">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Verified quote preview
            </span>
            <span>Ready</span>
          </div>
        </aside>
      </section>

      <Drawer.Root open={countrySheetOpen} onOpenChange={setCountrySheetOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-[28px] border border-border bg-card p-4 pb-5 outline-none">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={countrySearch}
                onChange={(event) => setCountrySearch(event.target.value)}
                placeholder="Search country"
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="mt-4 space-y-2">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountryCode(country.code);
                    setCountrySheetOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left ${selectedCountryCode === country.code ? "border-primary bg-secondary" : "border-border bg-background"}`}
                >
                  <span className="flex items-center gap-3">
                    <span>{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </span>
                  {selectedCountryCode === country.code && (
                    <Check className="size-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onSuccess={() =>
          toast.success("Gift card quote ready", {
            description: `Mock ${selectedBrand?.name ?? "gift card"} sale prepared.`,
          })
        }
        title="Confirm gift card sale"
        amount={`${localCurrency} ${exchangeInfo.finalPayout.toLocaleString()}`}
      />
    </div>
  );
}
