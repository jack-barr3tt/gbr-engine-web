// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3 

import { type Options } from "@hey-api/client-fetch";
import { type QueryClient } from "@tanstack/react-query";
import { getHealth, getLocations, getOperators, getSchema } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseGetHealth = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGetHealthKeyFn(clientOptions), queryFn: () => getHealth({ ...clientOptions }).then(response => response.data) });
export const prefetchUseGetSchema = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGetSchemaKeyFn(clientOptions), queryFn: () => getSchema({ ...clientOptions }).then(response => response.data) });
export const prefetchUseGetLocations = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGetLocationsKeyFn(clientOptions), queryFn: () => getLocations({ ...clientOptions }).then(response => response.data) });
export const prefetchUseGetOperators = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGetOperatorsKeyFn(clientOptions), queryFn: () => getOperators({ ...clientOptions }).then(response => response.data) });
