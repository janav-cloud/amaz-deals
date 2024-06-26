import { getOtherProducts, getProductById } from "@/lib/actions"
import { redirect } from "next/navigation";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { id: string }
}

const ProductDescription = async ({ params: { id } }: Props ) => {

  const product = await getProductById(id);
  const otherProducts = await getOtherProducts(id);
  
  if(!product) {
    console.log("Product ID Not Found!")
    redirect('/');
  }

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image 
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className='mx-auto'
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>

              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Check on Amazon 🔗
              </Link>
            </div>
            <div className='flex items-center gap-3'>
              <div className='product-hearts'>
                <Image
                  src='/assets/icons/red-heart.svg'
                  alt='heart'
                  width={20}
                  height={20}
                />

                <p className="text-base font-semibold text-pink-300">
                  = Coffee!
                </p>
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Link href="https://github.com/janav-007">
                  <Image 
                      src="/assets/icons/star.svg"
                      alt="star"
                      width={20}
                      height={20}
                  />
                </Link>

                <p className="text-base font-semibold text-secondary opacity-70">
                  Star on Github!
                </p>

                </div>

                <div className="p-2 bg-white-200 rounded-10">
                <Link href="https://linktr.ee/janavdua7">
                <Image 
                    src="/assets/icons/share.svg"
                    alt="share"
                    width={20}
                    height={20}
                  />
                </Link>

                <p className="text-base font-semibold text-secondary opacity-70">
                  Get to know me :)
                </p>
                </div>
            </div>
          </div>

          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {product.currentPrice}
              </p>
              <p className="text-[21px] text-secondary opacity-50 line-through">
                {product.currency} {product.originalPrice}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <span className="product-stars text-sm text-primary-orange font-black"><span className="text-[18px]">💸</span>{product.discountRate}%</span>
              </div>
            </div>
          </div>

          <div className='my-7 flex flex-col gap-5'>
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard 
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${product.currentPrice}`}
                borderColor="#B6DBFF"
              />

              <PriceInfoCard 
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${product.averagePrice}`}
                borderColor="#B6DBFF"
              />

              <PriceInfoCard 
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${product.highestPrice}`}
                borderColor="#B6DBFF"
              />

              <PriceInfoCard 
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${product.lowestPrice}`}
                borderColor="#B6DBFF"
              />
            </div>
          </div>
          <Modal productId={id} />
        </div>
      </div>

      <div className='flex flex-col gap-16'>
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">Product Description</h3>
          <div className="flex flex-col gap-4">
            {product?.description?.split('\n')}
          </div>
        </div>

        <button className="btn w-fit mx-auto flex item-center justify-center gap-3 min-w-[200px]">
          <Image 
            src='/assets/icons/bag.svg'
            alt='check'
            width={22}
            height={22}
          />
          <Link href={product.url} className='text-base text-white'>
            Buy Now
          </Link>
        </button>
      </div>
        {otherProducts && otherProducts.length > 0 && (
          <div className="py-14 flex flex-col gap-2 w-full">
            <p>Other Products</p>
            <div className="flex flex-wrap-gap-10 mt-7 w-full">
              {otherProducts.map((product) => 
                <ProductCard 
                key={product._id}
                product={product}
                />
              )}
            </div>
          </div>
        )}
    </div>
  )
}

export default ProductDescription