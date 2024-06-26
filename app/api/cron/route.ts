import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextRequest, NextResponse } from "next";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    connectToDB();
    const products = await Product.find({});

    if (!products) {
      console.log('No Products Found!');
      return res.status(404).json({ message: 'No products found' });
    }

    // CRON JOB

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) {
          console.log('No Current Product to Update!');
          return res.status(404).json({ message: 'No current product to update' });
        }

        const updatedPriceHistory = [
         ...currentProduct.priceHistory,
          { price: scrapedProduct.priceHistory },
        ];

        const product = {
         ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: scrapedProduct.url },
          product,
        );

        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(productInfo, emailNotifType);

          const userEmails = updatedProduct.users.map((user: any) => user.email);

          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      }),
    );

    return res.status(200).json({
      message: 'OK',
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Failed to GET:  ${error}`);
  }
}