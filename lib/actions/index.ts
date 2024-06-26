'use server'

import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getHighestPrice, getLowestPrice, getAveragePrice } from "../utils";
import { User } from "@/types";

export async function scrapeAndStoreProduct(productUrl: string) {
    if(!productUrl) {
        console.log("Unexpected Error!");
        return;
    }

    try {
        connectToDB();
        
        const scrapedProduct = await scrapeAmazonProduct(productUrl);

        if(!scrapedProduct) {
            alert("Product Not Found!");
            return;
        }

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({url: scrapedProduct.url});

        if(existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true },
        );

        revalidatePath(`/products/${newProduct._id}`);
    } catch (error: any) {
        throw new Error(`Failed to Create/Update Product: ${error.message}`);
    }
}

export async function getProductById(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({_id: productId});

        if(!product) {
            return null;
        }

        return product;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts() {
    try {
        connectToDB();
        const products = await Product.find()

        if(!products) {
            alert("No Products Currently in List!")
            return;
        }

        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function getOtherProducts(productId: string) {
    try {
        connectToDB();
        const current_product = await Product.findById(productId);

        if(!current_product) {
            return null;
        }

        const otherProducts = await Product.find({_id: { $ne: productId }}).limit(3)

        return otherProducts;
    } catch (error) {
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findById(productId);

        if(!product) {
            return null;
        }

        const userExists = product.users.some((user: User) => user.email === userEmail);

        if(!userExists) {
            product.users.push({ email: userEmail });
            await product.save();
            const emailContent = await generateEmailBody(product, 'WELCOME');
            await sendEmail(emailContent, [userEmail]);
        }
    } catch (error) {
        console.log(error)
    }
} 