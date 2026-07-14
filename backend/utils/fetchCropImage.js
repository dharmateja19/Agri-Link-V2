const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const fetchCropImage = async (cropName) => {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${cropName} crop&per_page=1&client_id=${ACCESS_KEY}`);
    const data = await res.json();
    return data.results[0]?.urls?.small || "";
};

export default fetchCropImage;