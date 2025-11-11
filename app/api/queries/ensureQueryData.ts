// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3 

import { type Options } from "@hey-api/client-fetch";
import { type QueryClient } from "@tanstack/react-query";
import { getHealth, getLocations, getOperators, getSchema, getService } from "../requests/services.gen";
import { GetServiceData } from "../requests/types.gen";
import * as Common from "./common";
export const ensureUseGetHealthData = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGetHealthKeyFn(clientOptions), queryFn: () => getHealth({ ...clientOptions }).then(response => response.data) });
export const ensureUseGetSchemaData = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGetSchemaKeyFn(clientOptions), queryFn: () => getSchema({ ...clientOptions }).then(response => response.data) });
export const ensureUseGetLocationsData = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGetLocationsKeyFn(clientOptions), queryFn: () => getLocations({ ...clientOptions }).then(response => response.data) });
export const ensureUseGetOperatorsData = (queryClient: QueryClient, clientOptions: Options<unknown, true> = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGetOperatorsKeyFn(clientOptions), queryFn: () => getOperators({ ...clientOptions }).then(response => response.data) });
export const ensureUseGetServiceData = (queryClient: QueryClient, clientOptions: Options<GetServiceData, true> = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGetServiceKeyFn(clientOptions), queryFn: () => getService({ ...clientOptions }).then(response => response.data) });
