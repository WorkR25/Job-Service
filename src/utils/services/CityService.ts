import axios from 'axios';

import logger from '../../configs/logger.config';
import { microServiceConfig } from '../../configs/server.config';
import { GetCityResponse } from '../../types/GetCityTypes';

export async function getCityById(id: number, jwtToken: string){
    let cityName;
    try{
        cityName = await axios.get<GetCityResponse>(
            `${microServiceConfig.USER_SERVICE_URL}city/${id}`,{
                headers:{
                    Authorization: jwtToken
                }
            }
        );
        return cityName;
    }catch(error){
        logger.error(error);
        throw error;
    }
}