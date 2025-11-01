// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3 

import { type Options } from "@hey-api/client-fetch";
import { UseQueryResult } from "@tanstack/react-query";
import { getHealth, getLocations, getOperators, queryServices } from "../requests/services.gen";
export type GetHealthDefaultResponse = Awaited<ReturnType<typeof getHealth>>["data"];
export type GetHealthQueryResult<TData = GetHealthDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGetHealthKey = "GetHealth";
export const UseGetHealthKeyFn = (clientOptions: Options<unknown, true> = {}, queryKey?: Array<unknown>) => [useGetHealthKey, ...(queryKey ?? [clientOptions])];
export type GetLocationsDefaultResponse = Awaited<ReturnType<typeof getLocations>>["data"];
export type GetLocationsQueryResult<TData = GetLocationsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGetLocationsKey = "GetLocations";
export const UseGetLocationsKeyFn = (clientOptions: Options<unknown, true> = {}, queryKey?: Array<unknown>) => [useGetLocationsKey, ...(queryKey ?? [clientOptions])];
export type GetOperatorsDefaultResponse = Awaited<ReturnType<typeof getOperators>>["data"];
export type GetOperatorsQueryResult<TData = GetOperatorsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGetOperatorsKey = "GetOperators";
export const UseGetOperatorsKeyFn = (clientOptions: Options<unknown, true> = {}, queryKey?: Array<unknown>) => [useGetOperatorsKey, ...(queryKey ?? [clientOptions])];
export type QueryServicesMutationResult = Awaited<ReturnType<typeof queryServices>>;
export const useQueryServicesKey = "QueryServices";
export const UseQueryServicesKeyFn = (mutationKey?: Array<unknown>) => [useQueryServicesKey, ...(mutationKey ?? [])];
