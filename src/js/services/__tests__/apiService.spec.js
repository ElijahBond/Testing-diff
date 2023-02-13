import api from '../apiService';
import config from '../../config/apiConfig';
import axios from 'axios';

jest.mock('axios');

const cities = [{country_code: 'RUS', name: 'NNov', code: 'NN'}];

describe('Test API Service', () => {
    test('Success fetch cities', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({data: cities}))
        await expect(api.cities()).resolves.toEqual(cities)
        expect(axios.get).toHaveBeenCalledWith(`${config.url}/cities`)
    })

    test('Fetch cities failure', async () => {
        const errMsg = 'Api Error'
        axios.get.mockImplementationOnce(() => Promise.reject(new Error(errMsg)))
        await expect(api.cities()).rejects.toThrow(errMsg)
    })
})