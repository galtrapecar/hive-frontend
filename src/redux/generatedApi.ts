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
          organizationId: queryArg.organizationId,
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    orderControllerFindOne: build.query<
      OrderControllerFindOneApiResponse,
      OrderControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/order/${queryArg.id}`,
        params: {
          organizationId: queryArg.organizationId,
        },
      }),
    }),
    orderControllerUpdate: build.mutation<
      OrderControllerUpdateApiResponse,
      OrderControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/order/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateOrderDto,
        params: {
          organizationId: queryArg.organizationId,
        },
      }),
    }),
    orderControllerRemove: build.mutation<
      OrderControllerRemoveApiResponse,
      OrderControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/order/${queryArg.id}`,
        method: "DELETE",
        params: {
          organizationId: queryArg.organizationId,
        },
      }),
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
    /** Order file (txt, pdf, xlsx) */
    file: Blob;
  };
};
export type OrderControllerCreateApiResponse =
  /** status 201  */ OrderResponseDto;
export type OrderControllerCreateApiArg = {
  createOrderDto: CreateOrderDto;
};
export type OrderControllerFindAllApiResponse =
  /** status 200  */ PaginatedOrderResponseDto;
export type OrderControllerFindAllApiArg = {
  organizationId: string;
  page?: string;
  limit?: string;
};
export type OrderControllerFindOneApiResponse =
  /** status 200  */ OrderResponseDto;
export type OrderControllerFindOneApiArg = {
  id: number;
  organizationId: string;
};
export type OrderControllerUpdateApiResponse =
  /** status 200  */ OrderResponseDto;
export type OrderControllerUpdateApiArg = {
  id: number;
  organizationId: string;
  updateOrderDto: UpdateOrderDto;
};
export type OrderControllerRemoveApiResponse =
  /** status 200  */ OrderResponseDto;
export type OrderControllerRemoveApiArg = {
  id: number;
  organizationId: string;
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
export type PlanDto = {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  orderId: number;
  createdAt: string;
  updatedAt: string;
};
export type OrderResponseDto = {
  id: number;
  organizationId: string;
  customer: string;
  price: number;
  weight: number;
  pickupPoint: string;
  pickupTime: string;
  dropoffPoint: string;
  dropoffTime: string;
  description?: string;
  plan?: PlanDto | null;
  createdAt: string;
  updatedAt: string;
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
export type PaginatedOrderMetaDto = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export type PaginatedOrderResponseDto = {
  data: OrderResponseDto[];
  meta: PaginatedOrderMetaDto;
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
