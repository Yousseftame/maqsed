import Image from "next/image";
import { Bed, Bath, LayoutGrid, MapPin } from "lucide-react";
import type { PropertyListing } from "@/features/properties/data/listings";

type PropertyDetailProps = {
  property: PropertyListing;
};

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [mainImage, topImage, bottomImage] = property.gallery;
  const addressLines = property.address.split("\n");

  return (
    <div className="w-full bg-white">
      {/* Gallery */}
      <section className="w-full px-6 pt-10 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl md:col-span-8 md:min-h-[520px] lg:min-h-[560px]">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 65vw"
            />
          </div>

          <div className="flex flex-col gap-4 md:col-span-4 md:gap-5">
            <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-3xl md:min-h-0">
              <Image
                src={topImage}
                alt={`${property.title} interior`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
            </div>
            <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-3xl md:min-h-0">
              <Image
                src={bottomImage}
                alt={`${property.title} living space`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left — still the larger column */}
          <div className="lg:col-span-7">
            <h1 className="mb-6 text-4xl font-bold tracking-tight whitespace-normal text-[#0a0f1d] sm:text-5xl md:whitespace-nowrap lg:text-[3.75rem] lg:leading-[1.15]">
              {property.title}
            </h1>

            <div className="mb-12 max-w-2xl text-base leading-[1.75] font-medium text-[#8c8c8c] sm:text-lg sm:leading-[1.8]">
              <p>{property.description}</p>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a0f1d]">
                Property Overview
              </h2>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-[#0a0f1d]">
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 stroke-[1.75]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.beds} Bedrooms
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-6 w-6 stroke-[1.75]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.baths} Bathrooms
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-6 w-6 stroke-[1.75]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.sqft} sq ft
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a0f1d]">
                Location
              </h2>
              <div className="mb-6 flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                <p className="max-w-sm text-base leading-relaxed font-medium whitespace-pre-line text-[#8c8c8c]">
                  {addressLines.join(",\n")}
                </p>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/properites/map.avif"
                  alt={`Map location for ${property.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar — wider than 1/3, still smaller than left */}
          <aside className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
                <p className="mb-2 text-base font-medium text-[#8c8c8c] sm:text-lg">Price</p>
                <p className="mb-6 text-4xl font-bold tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-[3.5rem]">
                  {property.price}
                </p>
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#0a0f1d] px-6 py-4 text-base font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-[#161c2d]"
                >
                  Payment Calculator
                </button>
              </div>

              <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
                  Thinking for buying?
                </h3>

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-[#0a0f1d] px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#161c2d]"
                  >
                    Tour in Person
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base font-semibold text-[#0a0f1d] transition-colors duration-200 hover:border-[#0a0f1d]"
                  >
                    Virtual Tour
                  </button>
                </div>

                <button
                  type="button"
                  className="mb-6 w-full rounded-xl border-2 border-[#0a0f1d]/35 bg-white px-4 py-3.5 text-base font-semibold text-[#0a0f1d] transition-colors duration-200 hover:border-[#0a0f1d] hover:bg-gray-50"
                >
                  Request Showing
                </button>

                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-sm font-semibold tracking-wide text-[#8c8c8c] sm:text-base">
                    or continue
                  </span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl bg-[#0a0f1d] px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#161c2d]"
                >
                  Start an Offers
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
