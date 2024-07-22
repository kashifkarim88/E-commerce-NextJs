import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const fetchOurProducts = async () => {
    const response = await axios.get(`/api/getOurProducts`);
    return response.data;
}

const fetchProductDetails = async ({ queryKey }) => {
    const prodId = queryKey[1];
    const response = await axios.get(`/api/products/${prodId}`);
    return response.data;
}
const fetchPriceProducts = async (page, limit, category, minPrice, maxPrice) => {
    const { data } = await axios.get('/api/getPriceSearchedProducts', {
        params: {
            page,
            limit,
            category,
            minPrice,
            maxPrice,
        },
    });
    return data;
};

export const usePriceProduct = (page, limit, category, minPrice, maxPrice) => {
    return useQuery(
        ['products-by-price', page, limit, category, minPrice, maxPrice],
        () => fetchPriceProducts(page, limit, category, minPrice, maxPrice),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );
};
const fetchPaginatedProducts = async (page, limit, category) => {
    const { data } = await axios.get('/api/products', {
        params: {
            page,
            limit,
            category,
        },
    });
    return data;
};

export const usePaginatedProduct = (page, limit, category) => {
    const queryClient = useQueryClient();

    return useQuery(
        ['products', page, limit, category],
        fetchPaginatedProducts,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            initialData: () => {
                return queryClient.getQueryData(['products', page, limit, category]); // Example initial data retrieval
            }
        }
    );
};


export const useProductsData = (onSuccess, onError) => {
    return useQuery(
        "Products-Data",
        fetchOurProducts,
        {
            onSuccess,
            onError,
            refetchOnWindowFocus: false,
        }
    );
}

export const useProductDetails = (Id) => {
    const queryClient = useQueryClient();

    return useQuery(
        ["Product-detail", Id],
        fetchProductDetails,
        {
            initialData: () => {
                const cachedData = queryClient.getQueryData('Product-detail');
                if (cachedData) {
                    const product = cachedData.results?.find((product) => product._id === parseInt(Id, 10));
                    if (product) {
                        return {
                            data: product
                        };
                    }
                }
                return undefined;
            },
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                console.log('Fetched data successfully:', data);
            },
            onError: (error) => {
                console.error('Error fetching data:', error);
            }
        }
    );
}

