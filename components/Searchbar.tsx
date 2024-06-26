'use client';

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const Searchbar = () => {

    const [SearchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isValidAmazonProductURL = (url: string) => {
        try {
            const parsedURL = new URL(url);
            const hostname = parsedURL.hostname;

            if(hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon')) {
                return true;
            }
        } catch (error) {
            console.log("Invalid Amazon URL!", error);
            return false;
        }
        return false;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const isValidLink = isValidAmazonProductURL(SearchPrompt);

        if(!isValidLink) {
            return alert('Invalid Amazon Link!');
        }

        try {
            setIsLoading(true);
            const product = await scrapeAndStoreProduct(SearchPrompt);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <form 
        className="flex flex-wrap gap-4 mt-12"
        onSubmit={ handleSubmit }    
    >
        <input 
            type="text"
            value={SearchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Enter Product URL"
            className="searchbar-input" 
        />

        <button
            type="submit"
            className="searchbar-btn"
            disabled={ SearchPrompt === '' || isLoading === true}
        >
            {isLoading ? 'Searching...' : 'Search'}
        </button>
    </form>
  )

}

export default Searchbar