'use client'

import { useProductsData } from '@/hooks/reactProductsKook/useAllProducts'
import LatestProducts from '../latestproducts/page'
import OurProductCard from '../allProductsList/ourproductcard/page ';
export default function AllProductsList() {
    const onSuccess = (data) => {
        console.log("Perform Side effects after fetching the data", data);
    }
    const onError = (error) => {
        console.log("Perform Side effects after encountering an error", error);
    }

    const { isLoading, data, isError, error, isFetching } = useProductsData(onSuccess, onError);


    if (isLoading || isFetching) {
        return <h2>Loading...</h2>;
    }

    if (isError) {
        return <h3>{error.message}</h3>;
    }

    return (
        <>
            <main className='w-full'>
                {
                    data?.length > 0 ?
                        <OurProductCard product={data} /> : (
                            <div>
                                <h2>Something went wrong please try again or check Internet Connection</h2>
                            </div>
                        )
                }
                <LatestProducts />
            </main>
        </>
    );
}
