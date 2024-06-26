import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice, extractCurrency, extractDescription } from "../utils";

export async function scrapeAmazonProduct(url: string) {
    if(!url) {
        console.log("Unexpected Error!")
        return;
    }

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_fe1c5db6-zone-web_unlocker1:do2drnr7wqpr -k "http://geo.brdtest.com/mygeo.json"

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_USERNAME);
    const port = 22225
    const session_id = (100000 * Math.random()) | 0;
    const options = {
        auth : {
            username: `${username}.session.${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }
    
    try {
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);
        const title = $('#productTitle').text().trim();

        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base')
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        const outOfStock = $('#availability span').text().trim().toLowerCase();

        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

        const description = extractDescription($);

        const data = {
            url,
            currency: currency || '',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            discountRate,
            priceHistory: [],
            category: 'category',
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(originalPrice) || Number(currentPrice)
        }
        
        return data;

    } catch (error: any) {
        throw new Error(`Failed to GET Product: ${error.message}`);
    }
}