import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const userManagementApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Sellers', 'Buyers', 'SellerStats', 'BuyerStats'],
  endpoints: (builder) => ({
    // ============================================
    // SELLER ENDPOINTS
    // ============================================
    getAllSellers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/sellers',
        params: { page, limit },
      }),
      transformResponse: (response) => {
        if (response && response.data) {
          const transformedSellers = response.data.map(seller => ({
            id: seller.id,
            store_name: seller.store_name,
            store_logo_url: seller.store_logo || '',
            store_banner_url: seller.store_banner || '',
            business_email: seller.business_email,
            business_phone: seller.phone,
            business_address: seller.address,
            business_city: seller.city,
            business_state: seller.state,
            business_zip: seller.postal_code,
            approval_status: seller.approval_status,
            status: seller.status,
            created_at: seller.created_at,
            updated_at: seller.updated_at,
            store_description: seller.store_description,
            business_type: seller.business_type,
            tax_id: seller.tax_number,
            business_registration_number: seller.business_license,
            store_website: seller.website,
            total_sales: seller.total_sales,
            total_reviews: seller.total_reviews,
            average_rating: seller.average_rating,
          }));

          return {
            data: transformedSellers,
            pagination: {
              current_page: response.page,
              total_pages: Math.ceil(response.total / response.limit),
              total_items: response.total,
              limit: response.limit,
            },
          };
        }
        return { data: [], pagination: {} };
      },
      providesTags: ['Sellers'],
    }),
    getPendingSellers: builder.query({
      query: () => '/sellers/pending',
      providesTags: ['Sellers'],
    }),
    searchSellers: builder.query({
      query: ({ query, status }) => ({
        url: '/sellers/search',
        params: { q: query, status },
      }),
      providesTags: ['Sellers'],
    }),
    getSellerStats: builder.query({
      query: () => '/sellers/stats',
      transformResponse: (response) => {
        if (response.status === 'success' && response.data) {
          return {
            data: {
              total_sellers: response.data.total || 0,
              approved_sellers: response.data.approved || 0,
              pending_sellers: response.data.pending || 0,
              rejected_sellers: response.data.rejected || 0,
              suspended_sellers: response.data.suspended || 0,
            },
          };
        }
        return {
          data: {
            total_sellers: 0,
            approved_sellers: 0,
            pending_sellers: 0,
            rejected_sellers: 0,
            suspended_sellers: 0,
          },
        };
      },
      providesTags: ['SellerStats'],
    }),
    getTopSellers: builder.query({
      query: (limit = 5) => ({
        url: '/sellers/top',
        params: { limit },
      }),
      providesTags: ['Sellers'],
    }),
    getSellerById: builder.query({
      query: (sellerId) => ({
        url: '/sellers/get',
        params: { id: sellerId },
      }),
      transformResponse: (response) => {
        if (response.status === 'success' && response.data) {
          const seller = response.data;
          return {
            data: {
              id: seller.id,
              store_name: seller.store_name,
              store_logo_url: seller.store_logo || '',
              store_banner_url: seller.store_banner || '',
              business_email: seller.business_email,
              business_phone: seller.phone,
              business_address: seller.address,
              business_city: seller.city,
              business_state: seller.state,
              business_zip: seller.postal_code,
              approval_status: seller.approval_status,
              status: seller.status,
              created_at: seller.created_at,
              updated_at: seller.updated_at,
              store_description: seller.store_description,
              business_type: seller.business_type,
              tax_id: seller.tax_number,
              business_registration_number: seller.business_license,
              store_website: seller.website,
              commission: seller.commission,
              payment_methods: seller.payment_methods && Array.isArray(seller.payment_methods) 
                ? seller.payment_methods.map(method => ({
                    id: method.id,
                    type: method.type,
                    account_name: method.account_name,
                    account_number: method.account_number,
                    bank_name: method.bank_name,
                    bank_code: method.bank_code,
                    routing_number: method.routing_number,
                    is_default: method.is_default,
                    is_active: method.is_active,
                    created_at: method.created_at,
                    updated_at: method.updated_at,
                  }))
                : [],
            },
          };
        }
        return { data: null };
      },
      providesTags: (result, error, id) => [{ type: 'Sellers', id }],
    }),
    approveSeller: builder.mutation({
      query: ({ sellerId, notes }) => ({
        url: '/sellers/approve',
        method: 'POST',
        params: { id: sellerId },
        body: { notes: notes || '' },
      }),
      invalidatesTags: ['Sellers', 'SellerStats'],
    }),
    rejectSeller: builder.mutation({
      query: ({ sellerId, reason }) => ({
        url: '/sellers/reject',
        method: 'POST',
        params: { id: sellerId },
        body: { reason: reason || '' },
      }),
      invalidatesTags: ['Sellers', 'SellerStats'],
    }),
    suspendSeller: builder.mutation({
      query: ({ sellerId, reason }) => ({
        url: '/sellers/suspend',
        method: 'POST',
        params: { id: sellerId },
        body: { reason: reason || '' },
      }),
      invalidatesTags: ['Sellers', 'SellerStats'],
    }),
    reactivateSeller: builder.mutation({
      query: ({ sellerId, notes }) => ({
        url: '/sellers/reactivate',
        method: 'POST',
        params: { id: sellerId },
        body: { notes: notes || '' },
      }),
      invalidatesTags: ['Sellers', 'SellerStats'],
    }),

    // ============================================
    // BUYER ENDPOINTS
    // ============================================
    getAllBuyers: builder.query({
      async queryFn(arg, api, extraOptions, baseQuery) {
        let allBuyers = [];
        let page = 1;
        let hasMore = true;

        try {
          // Keep fetching until we get all buyers
          while (hasMore) {
            const response = await baseQuery({
              url: '/buyers',
              params: { page, limit: 100 },
            });

            if (response.error) {
              return { error: response.error };
            }

            const data = response.data.data || [];
            
            if (data.length === 0) {
              hasMore = false;
              break;
            }

            allBuyers = [...allBuyers, ...data];
            
            // If we got less than 100 items, we've reached the end
            if (data.length < 100) {
              hasMore = false;
            } else {
              page++;
            }
          }

          // Transform the data
          const transformedBuyers = allBuyers.map(buyer => ({
            id: buyer.id,
            name: buyer.reg_user ? `${buyer.reg_user.first_name} ${buyer.reg_user.last_name}` : 'N/A',
            email: buyer.reg_user?.email || buyer.email,
            avatar_url: buyer.profile_picture_url || buyer.reg_user?.profile_photo || '',
            status: buyer.status || 'active',
            total_orders: buyer.total_orders_count || 0,
            total_spent: buyer.total_spent || 0,
            created_at: buyer.created_at,
            phone: buyer.phone || buyer.reg_user?.phone || '',
            is_active: buyer.is_active,
            email_verified: buyer.email_verified,
          }));

          return {
            data: {
              data: transformedBuyers,
              pagination: {
                total_items: transformedBuyers.length,
              },
            },
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Buyers'],
    }),
    searchBuyers: builder.query({
      query: ({ query, status }) => ({
        url: '/buyers/search',
        params: { q: query, status },
      }),
      providesTags: ['Buyers'],
    }),
    getBuyerStats: builder.query({
      query: () => '/buyers/stats',
      transformResponse: (response) => {
        if (response.status === 'success' && response.data) {
          return {
            data: {
              total_buyers: response.data.total || 0,
              active_buyers: response.data.active || 0,
              inactive_buyers: response.data.inactive || 0,
              suspended_buyers: response.data.suspended || 0,
            },
          };
        }
        return {
          data: {
            total_buyers: 0,
            active_buyers: 0,
            inactive_buyers: 0,
            suspended_buyers: 0,
          },
        };
      },
      providesTags: ['BuyerStats'],
    }),
    getBuyerById: builder.query({
      query: (buyerId) => ({
        url: '/buyers/get',
        params: { id: buyerId },
      }),
      transformResponse: (response) => {
        if (response.status === 'success' && response.data) {
          const buyer = response.data;
          return {
            data: {
              id: buyer.id,
              phone: buyer.phone || 'N/A',
              default_address: buyer.default_address || 'Not set',
              status: buyer.status || 'active',
              is_active: buyer.is_active,
              email_verified: buyer.email_verified,
              total_orders: buyer.total_orders_count || 0,
              total_spent: buyer.total_spent || 0,
              created_at: buyer.created_at,
              updated_at: buyer.updated_at,
              addresses: buyer.addresses || [],
            },
          };
        }
        return { data: null };
      },
      providesTags: (result, error, id) => [{ type: 'Buyers', id }],
    }),
    activateBuyer: builder.mutation({
      query: ({ buyerId, notes }) => ({
        url: '/buyers/activate',
        method: 'POST',
        params: { id: buyerId },
        body: { notes: notes || '' },
      }),
      transformResponse: (response) => {
        if (response.status === 'success') {
          return { success: true, message: response.message };
        }
        return response;
      },
      invalidatesTags: ['Buyers', 'BuyerStats'],
    }),
    deactivateBuyer: builder.mutation({
      query: ({ buyerId, reason }) => ({
        url: '/buyers/deactivate',
        method: 'POST',
        params: { id: buyerId },
        body: { reason: reason || '' },
      }),
      transformResponse: (response) => {
        if (response.status === 'success') {
          return { success: true, message: response.message };
        }
        return response;
      },
      invalidatesTags: ['Buyers', 'BuyerStats'],
    }),
    suspendBuyer: builder.mutation({
      query: ({ buyerId, reason }) => ({
        url: '/buyers/suspend',
        method: 'POST',
        params: { id: buyerId },
        body: { reason: reason || '' },
      }),
      transformResponse: (response) => {
        if (response.status === 'success') {
          return { success: true, message: response.message };
        }
        return response;
      },
      invalidatesTags: ['Buyers', 'BuyerStats'],
    }),
  }),
});

export const {
  // Seller hooks
  useGetAllSellersQuery,
  useGetPendingSellersQuery,
  useSearchSellersQuery,
  useGetSellerStatsQuery,
  useGetTopSellersQuery,
  useGetSellerByIdQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useSuspendSellerMutation,
  useReactivateSellerMutation,
  
  // Buyer hooks
  useGetAllBuyersQuery,
  useSearchBuyersQuery,
  useGetBuyerStatsQuery,
  useGetBuyerByIdQuery,
  useActivateBuyerMutation,
  useDeactivateBuyerMutation,
  useSuspendBuyerMutation,
} = userManagementApi;