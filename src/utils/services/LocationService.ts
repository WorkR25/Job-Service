import axios from 'axios';

import logger from '../../configs/logger.config';
import { microServiceConfig } from '../../configs/server.config';
import { GetLocationResponse } from '../../types/GetLocationTypes';
import { InternalServerError } from '../errors/app.error';

export async function getLocationById(id: number){
    let location;
    try{
        location = await axios.get<GetLocationResponse>(
            `${microServiceConfig.USER_SERVICE_URL}locations/${id}`
        );
        return location;
    }catch(error){
        logger.error(error);
        throw new InternalServerError('Error fetching location details');
    }
}

type CityListResponse = {
    success: boolean;
    data: { id: number; name: string }[];
};

const REMOTE_IDS_TTL_MS = 10 * 60 * 1000;
let remoteIdsCache: { ids: number[]; fetchedAt: number } | null = null;

/**
 * IDs of locations named "Remote" (User-Service stores remote as a city).
 * Cached for 10 minutes; returns the last known value (or []) if the lookup fails.
 */
export async function getRemoteLocationIds(): Promise<number[]> {
    if (remoteIdsCache && Date.now() - remoteIdsCache.fetchedAt < REMOTE_IDS_TTL_MS) {
        return remoteIdsCache.ids;
    }
    try {
        const response = await axios.get<CityListResponse>(
            `${microServiceConfig.USER_SERVICE_URL}city`,
            { params: { city: 'Remote' } }
        );
        const ids = (response.data?.data ?? [])
            .filter((city) => city.name?.trim().toLowerCase() === 'remote')
            .map((city) => city.id);
        remoteIdsCache = { ids, fetchedAt: Date.now() };
        return ids;
    } catch (error) {
        logger.error('LocationService/getRemoteLocationIds', { error });
        return remoteIdsCache?.ids ?? [];
    }
}
