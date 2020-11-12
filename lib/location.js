const { fetchJson } = require('../utils/fetcher')

async function getZoneStatus (latitude, longitude, userId = '2d8ecc70-8310-11ea-84f8-13de98afc5a4') {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVsa29tOmRhMWMyNWQ4LTM3YzgtNDFiMS1hZmUyLTQyZGQ0ODI1YmZlYQ== ',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                userId
            })
        }
        fetchJson('https://api.pedulilindungi.id/zone/v1', options)
            .then(json => {
                const result = {
                    kode: json.data.zone,
                    status: '',
                    optional: ''
                }

                switch (json.data.zone) {
                case 'red':
                    result.status = 'Anda berada di Zona Merah penyebaran COVID-19.'
                    result.optional = 'Zona Merah adalah area yang sudah terdapat kasus Positif COVID-19.'
                    break
                case 'yellow':
                    result.status = 'Anda berada di Zona Kuning penyebaran COVID-19.'
                    result.optional = 'Zona Kuning adalah area yang sudah terdapat kasus ODP atau PDP COVID-19.'
                    break
                case 'green':
                    result.status = 'Anda berada di Zona Hijau penyebaran COVID-19.'
                    result.optional = 'Zona Hijau adalah area yang belum terdapat kasus PDP atau Positif COVID-19.'
                    break
                }

                if (!json.success && json.message == 'Anda berada di zona aman.') {
                    result.kode = 'green'
                    result.status = 'Anda berada di Zona Hijau penyebaran COVID-19.'
                    result.optional = 'Zona Hijau adalah area yang belum terdapat kasus PDP atau Positif COVID-19.'
                }
                resolve(result)
            })
            .catch((err) => reject(err))
    })
}

async function getArea (latitude, longitude, size = 10) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: ' Basic dGVsa29tOmRhMWMyNWQ4LTM3YzgtNDFiMS1hZmUyLTQyZGQ0ODI1YmZlYQ== ',
                'Content-Type': ' application/json '
            }
        }
        fetchJson(`https://api.pedulilindungi.id/zone/v1/location/area?latitude=${latitude}&longitude=${longitude}&page=1&size=${size}`, options)
            .then(json => {
                if (json.success && json.code == 200) resolve(json)
            })
            .catch((err) => reject(err))
    })
};

module.exports = getLocationData = async (latitude, longitude) => {
    try {
        const responses = await Promise.all([getZoneStatus(latitude, longitude), getArea(latitude, longitude)])
        const result = {
            kode: 200,
            status: responses[0].status,
            optional: responses[0].optional,
            data: []
        }
        responses[1].data.map((x) => result.data.push(x))
        return result
    } catch (err) {
        console.log(err)
        return { kode: 0 }
    }
}
