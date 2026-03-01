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
    routingControllerGeocode: build.query<
      RoutingControllerGeocodeApiResponse,
      RoutingControllerGeocodeApiArg
    >({
      query: (queryArg) => ({
        url: `/routing/geocode`,
        params: {
          q: queryArg.q,
          limit: queryArg.limit,
        },
      }),
    }),
    routingControllerReverseGeocode: build.query<
      RoutingControllerReverseGeocodeApiResponse,
      RoutingControllerReverseGeocodeApiArg
    >({
      query: (queryArg) => ({
        url: `/routing/reverse-geocode`,
        params: {
          lat: queryArg.lat,
          lng: queryArg.lng,
          limit: queryArg.limit,
        },
      }),
    }),
    vehicleControllerCreate: build.mutation<
      VehicleControllerCreateApiResponse,
      VehicleControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/vehicle`,
        method: "POST",
        body: queryArg.createVehicleDto,
      }),
    }),
    vehicleControllerFindAll: build.query<
      VehicleControllerFindAllApiResponse,
      VehicleControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/vehicle`,
        params: {
          organizationId: queryArg.organizationId,
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    vehicleControllerFindOne: build.query<
      VehicleControllerFindOneApiResponse,
      VehicleControllerFindOneApiArg
    >({
      query: (queryArg) => ({
        url: `/vehicle/${queryArg.id}`,
        params: {
          organizationId: queryArg.organizationId,
        },
      }),
    }),
    vehicleControllerUpdate: build.mutation<
      VehicleControllerUpdateApiResponse,
      VehicleControllerUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/vehicle/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.updateVehicleDto,
        params: {
          organizationId: queryArg.organizationId,
        },
      }),
    }),
    vehicleControllerRemove: build.mutation<
      VehicleControllerRemoveApiResponse,
      VehicleControllerRemoveApiArg
    >({
      query: (queryArg) => ({
        url: `/vehicle/${queryArg.id}`,
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
export type RoutingControllerGeocodeApiResponse =
  /** status 200  */ GeocodeResponseItemDto[];
export type RoutingControllerGeocodeApiArg = {
  q: string;
  limit?: number;
};
export type RoutingControllerReverseGeocodeApiResponse =
  /** status 200  */ GeocodeResponseItemDto[];
export type RoutingControllerReverseGeocodeApiArg = {
  lat: number;
  lng: number;
  limit?: number;
};
export type VehicleControllerCreateApiResponse =
  /** status 201  */ VehicleResponseDto;
export type VehicleControllerCreateApiArg = {
  createVehicleDto: CreateVehicleDto;
};
export type VehicleControllerFindAllApiResponse =
  /** status 200  */ PaginatedVehicleResponseDto;
export type VehicleControllerFindAllApiArg = {
  organizationId: string;
  page?: string;
  limit?: string;
};
export type VehicleControllerFindOneApiResponse =
  /** status 200  */ VehicleResponseDto;
export type VehicleControllerFindOneApiArg = {
  id: number;
  organizationId: string;
};
export type VehicleControllerUpdateApiResponse =
  /** status 200  */ VehicleResponseDto;
export type VehicleControllerUpdateApiArg = {
  id: number;
  organizationId: string;
  updateVehicleDto: UpdateVehicleDto;
};
export type VehicleControllerRemoveApiResponse =
  /** status 200  */ VehicleResponseDto;
export type VehicleControllerRemoveApiArg = {
  id: number;
  organizationId: string;
};
export type ExtractedOrderDto = {
  customer: string;
  price: number;
  weight: number;
  pickupPoint: string;
  pickupLat?: number;
  pickupLng?: number;
  pickupTime: string;
  dropoffPoint: string;
  dropoffLat?: number;
  dropoffLng?: number;
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
  pickupLat?: number | null;
  pickupLng?: number | null;
  pickupTime: string;
  dropoffPoint: string;
  dropoffLat?: number | null;
  dropoffLng?: number | null;
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
  pickupLat?: number;
  pickupLng?: number;
  pickupTime: string;
  dropoffPoint: string;
  dropoffLat?: number;
  dropoffLng?: number;
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
  pickupLat?: number;
  pickupLng?: number;
  pickupTime?: string;
  dropoffPoint?: string;
  dropoffLat?: number;
  dropoffLng?: number;
  dropoffTime?: string;
  description?: string;
};
export type GeocodeResponseItemDto = {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  city?: string;
  state?: string;
  postcode?: string;
  street?: string;
  housenumber?: string;
};
export type VehicleResponseDto = {
  id: number;
  organizationId: string;
  registrationPlate: string;
  internalNumber?: string | null;
  type:
    | "OTHER"
    | "BOX_TRUCK"
    | "WALKING_FLOOR"
    | "COIL"
    | "CONTAINER"
    | "CAR_TRANSPORTER"
    | "TANKER"
    | "TARPAULIN"
    | "FLATBED"
    | "REFRIGERATOR"
    | "TIPPER"
    | "SILO";
  make?: string | null;
  model?: string | null;
  year?: number | null;
  vin?: string | null;
  /** Payload capacity in kg */
  payloadCapacity?: number | null;
  /** Gross weight in kg */
  grossWeight?: number | null;
  /** Loading meters */
  loadingMeters?: number | null;
  /** Height in meters */
  height?: number | null;
  /** Width in meters */
  width?: number | null;
  /** Length in meters */
  length?: number | null;
  /** Volume in m³ */
  volume?: number | null;
  /** Number of axles */
  axles?: number | null;
  /** ADR dangerous goods class */
  adrClass?:
    | (
        | "CLASS_1"
        | "CLASS_2"
        | "CLASS_3"
        | "CLASS_4"
        | "CLASS_5"
        | "CLASS_6"
        | "CLASS_7"
        | "CLASS_8"
        | "CLASS_9"
      )
    | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};
export type CreateVehicleDto = {
  organizationId: string;
  registrationPlate: string;
  internalNumber?: string;
  type:
    | "OTHER"
    | "BOX_TRUCK"
    | "WALKING_FLOOR"
    | "COIL"
    | "CONTAINER"
    | "CAR_TRANSPORTER"
    | "TANKER"
    | "TARPAULIN"
    | "FLATBED"
    | "REFRIGERATOR"
    | "TIPPER"
    | "SILO";
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  /** Height in meters */
  height?: number;
  /** Width in meters */
  width?: number;
  /** Length in meters */
  length?: number;
  /** Payload capacity in kg */
  payloadCapacity?: number;
  /** Gross weight in kg */
  grossWeight?: number;
  /** Loading meters */
  loadingMeters?: number;
  /** Volume in m³ */
  volume?: number;
  /** Number of axles */
  axles?: number;
  /** ADR dangerous goods class */
  adrClass?:
    | "CLASS_1"
    | "CLASS_2"
    | "CLASS_3"
    | "CLASS_4"
    | "CLASS_5"
    | "CLASS_6"
    | "CLASS_7"
    | "CLASS_8"
    | "CLASS_9";
};
export type PaginatedVehicleMetaDto = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export type PaginatedVehicleResponseDto = {
  data: VehicleResponseDto[];
  meta: PaginatedVehicleMetaDto;
};
export type UpdateVehicleDto = {
  organizationId?: string;
  registrationPlate?: string;
  internalNumber?: string;
  type?:
    | "OTHER"
    | "BOX_TRUCK"
    | "WALKING_FLOOR"
    | "COIL"
    | "CONTAINER"
    | "CAR_TRANSPORTER"
    | "TANKER"
    | "TARPAULIN"
    | "FLATBED"
    | "REFRIGERATOR"
    | "TIPPER"
    | "SILO";
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  /** Height in meters */
  height?: number;
  /** Width in meters */
  width?: number;
  /** Length in meters */
  length?: number;
  /** Payload capacity in kg */
  payloadCapacity?: number;
  /** Gross weight in kg */
  grossWeight?: number;
  /** Loading meters */
  loadingMeters?: number;
  /** Volume in m³ */
  volume?: number;
  /** Number of axles */
  axles?: number;
  /** ADR dangerous goods class */
  adrClass?:
    | "CLASS_1"
    | "CLASS_2"
    | "CLASS_3"
    | "CLASS_4"
    | "CLASS_5"
    | "CLASS_6"
    | "CLASS_7"
    | "CLASS_8"
    | "CLASS_9";
};
export const {
  useAppControllerGetHelloQuery,
  useLazyAppControllerGetHelloQuery,
  useAiControllerExtractOrderFromFileMutation,
  useOrderControllerCreateMutation,
  useOrderControllerFindAllQuery,
  useLazyOrderControllerFindAllQuery,
  useOrderControllerFindOneQuery,
  useLazyOrderControllerFindOneQuery,
  useOrderControllerUpdateMutation,
  useOrderControllerRemoveMutation,
  useRoutingControllerGeocodeQuery,
  useLazyRoutingControllerGeocodeQuery,
  useRoutingControllerReverseGeocodeQuery,
  useLazyRoutingControllerReverseGeocodeQuery,
  useVehicleControllerCreateMutation,
  useVehicleControllerFindAllQuery,
  useLazyVehicleControllerFindAllQuery,
  useVehicleControllerFindOneQuery,
  useLazyVehicleControllerFindOneQuery,
  useVehicleControllerUpdateMutation,
  useVehicleControllerRemoveMutation,
} = injectedRtkApi;
