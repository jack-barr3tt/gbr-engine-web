// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3 

import { type Options } from "@hey-api/client-fetch";
import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getHealth, getLocations, getOperators } from "../requests/services.gen";
import { GetHealthError, GetLocationsError, GetOperatorsError } from "../requests/types.gen";
import * as Common from "./common";
export const useGetHealthSuspense = <TData = Common.GetHealthDefaultResponse, TError = GetHealthError, TQueryKey extends Array<unknown> = unknown[]>(clientOptions: Options<unknown, true> = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGetHealthKeyFn(clientOptions, queryKey), queryFn: () => getHealth({ ...clientOptions }).then(response => response.data as TData) as TData, ...options });
export const useGetLocationsSuspense = <TData = Common.GetLocationsDefaultResponse, TError = GetLocationsError, TQueryKey extends Array<unknown> = unknown[]>(clientOptions: Options<unknown, true> = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGetLocationsKeyFn(clientOptions, queryKey), queryFn: () => getLocations({ ...clientOptions }).then(response => response.data as TData) as TData, ...options });
export const useGetOperatorsSuspense = <TData = Common.GetOperatorsDefaultResponse, TError = GetOperatorsError, TQueryKey extends Array<unknown> = unknown[]>(clientOptions: Options<unknown, true> = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGetOperatorsKeyFn(clientOptions, queryKey), queryFn: () => getOperators({ ...clientOptions }).then(response => response.data as TData) as TData, ...options });
