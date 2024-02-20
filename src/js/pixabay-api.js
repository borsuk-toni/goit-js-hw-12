import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImages(searchValue, page = 1) {
    const res = await axios.get('', {
        params: {
            key: '42343629-db0a88f68e5938b107ae69266',
            q: `${searchValue.trim()}`
                .split(' ')
                .map(value => {
                    return value.toLowerCase().trim();
                })
                .join('+'),
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page,
            per_page: 15
        }
    });

    return res.data;
}