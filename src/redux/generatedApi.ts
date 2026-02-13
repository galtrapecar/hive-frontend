import { baseApi as api } from "./baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    appControllerGetHello: build.query<
      AppControllerGetHelloApiResponse,
      AppControllerGetHelloApiArg
    >({
      query: () => ({ url: `/` }),
    }),
    aiControllerExtractOrderFromFile: build.mutation<
      AiControllerExtractOrderFromFileApiResponse,
      AiControllerExtractOrderFromFileApiArg
    >({
      query: (queryArg) => ({
        url: `/ai/extract-order`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    orderControllerCreate: build.mutation<
      OrderControllerCreateApiResponse,
      OrderControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/order`,
        method: "POST",
        body: queryArg.createOrderDto,
      }),
    }),
    orderControllerFindAll: build.query<
      OrderControllerFindAllApiResponse,
      OrderControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/order`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    orderControllerFindOne: build.query<
      OrderControllerFindOneApiResponse,
      OrderControllerFindOneApiArg
    >({
      query: (queryArg) => ({ url: `/order/${queryArg.id}` }),
    }),
    orderControllerUpdate: build.mutation<
      OrderControllerUpdateApiResponse,
      OrderControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/order/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateOrderDto,
      }),
    }),
    orderControllerRemove: build.mutation<
      OrderControllerRemoveApiResponse,
      OrderControllerRemoveApiArg
    >({
      query: (queryArg) => ({ url: `/order/${queryArg.id}`, method: "DELETE" }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
export type AppControllerGetHelloApiResponse = unknown;
export type AppControllerGetHelloApiArg = void;
export type AiControllerExtractOrderFromFileApiResponse =
  /** status 201 Extracted order details */ ExtractedOrderDto;
export type AiControllerExtractOrderFromFileApiArg = {
  /** File to extract order details from (txt, pdf, xlsx) */
  body: {
    file: Blob;
  };
};
export type OrderControllerCreateApiResponse = unknown;
export type OrderControllerCreateApiArg = {
  createOrderDto: CreateOrderDto;
};
export type OrderControllerFindAllApiResponse = unknown;
export type OrderControllerFindAllApiArg = {
  page?: string;
  limit?: string;
};
export type OrderControllerFindOneApiResponse = unknown;
export type OrderControllerFindOneApiArg = {
  id: number;
};
export type OrderControllerUpdateApiResponse = unknown;
export type OrderControllerUpdateApiArg = {
  id: number;
  updateOrderDto: UpdateOrderDto;
};
export type OrderControllerRemoveApiResponse = unknown;
export type OrderControllerRemoveApiArg = {
  id: number;
};
export type ExtractedOrderDto = {
  customer: string;
  price: number;
  weight: number;
  pickupPoint: string;
  pickupTime: string;
  dropoffPoint: string;
  dropoffTime: string;
  description?: string;
};
export type CreateOrderDto = {
  organizationId: string;
  customer: string;
  price: number;
  weight: number;
  pickupPoint: string;
  pickupTime: string;
  dropoffPoint: string;
  dropoffTime: string;
  description?: string;
};
export type UpdateOrderDto = {
  organizationId?: string;
  customer?: string;
  price?: number;
  weight?: number;
  pickupPoint?: string;
  pickupTime?: string;
  dropoffPoint?: string;
  dropoffTime?: string;
  description?: string;
};
export const {
  useAppControllerGetHelloQuery,
  useAiControllerExtractOrderFromFileMutation,
  useOrderControllerCreateMutation,
  useOrderControllerFindAllQuery,
  useOrderControllerFindOneQuery,
  useOrderControllerUpdateMutation,
  useOrderControllerRemoveMutation,
} = injectedRtkApi;
