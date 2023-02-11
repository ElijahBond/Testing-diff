import locationsInstance, { Locations } from '../locations';
import { formatDate } from '../../helpers/date';
import api, { Api } from '../../services/apiService';

const countries = [{code: 'RUS', name: 'Russia'}]
const cities = [{country_code: 'RUS', name: 'NNov', code: 'NN'}]
const airlines = [{country_code: 'RUS', name: 'Airlines', code: 'AVIA'}]

jest.mock('../../services/apiService', () => {
    const mockApi  = {
        countries: jest.fn(() => Promise.resolve([{code: 'RUS', name: 'Russia'}])),
        cities: jest.fn(() => Promise.resolve([{country_code: 'RUS', name: 'NNov', code: 'NN'}])),
        airlines: jest.fn(() => Promise.resolve([{country_code: 'RUS', name: 'Airlines', code: 'AVIA'}]))
    }

    return {
        Api: jest.fn(() => mockApi)
    }
})

const apiService = new Api();

describe('Locations store tests', () => {
    beforeEach(() => {
        locationsInstance.countries = locationsInstance.serializeCountries(countries)
        locationsInstance.cities = locationsInstance.serializeCities(cities)
    })

    test('Check locationInstance is instance of Location class', () => {
        expect(locationsInstance).toBeInstanceOf(Locations)
    })

    test('Success Location instance create', () => {
        const instance = new Locations(api, { formatDate });
        expect(instance.countries).toBe(null)
        expect(instance.shortCities).toEqual({})
        expect(instance.formatDate).toEqual(formatDate)
    })

    test('Check correct countries serialize', () => {
        const res = locationsInstance.serializeCountries(countries)
        const expectedData = {
            RUS: {code: 'RUS', name: 'Russia'}
        }

        expect(res).toEqual(expectedData);
    })

    test('Check countries serialize with incorrect data', () => {
        const res = locationsInstance.serializeCountries(null)
        const expectedData = {}

        expect(res).toEqual(expectedData);
    })

    test('Check correct cities serialize', () => {
        const res = locationsInstance.serializeCities(cities)
        const expectedData = {
            NN: {
                    country_code: 'RUS',
                    name: 'NNov',
                    code: 'NN',
                    country_name: 'Russia',
                    full_name: 'NNov,Russia'
                }
        }

        expect(res).toEqual(expectedData);
    })

    test('Check correct get city by code', () => {
        const res = locationsInstance.getCityNameByCode('NN')
        
        expect(res).toBe("NNov")
    })

    test('Check correct init method call', () => {
        const instance = new Locations(apiService, {formatDate})
        
        expect(instance.init()).resolves.toEqual([countries, cities, airlines])
    })
})