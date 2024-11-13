const genres = {
    anime: {
        suffix: ", anime style art, high quality, detailed character design",
        settings: {
            steps: 35,
            guidance_scale: 7.0,
            negative_prompt: "photorealistic, western art style, low quality"
        }
    },
    sports: {
        suffix: ", professional sports photography, high resolution, action shot",
        settings: {
            steps: 40,
            guidance_scale: 8.0,
            negative_prompt: "cartoon, illustration, blurry, low quality"
        }
    },
    movie: {
        suffix: ", cinematic lighting, movie scene, high production value",
        settings: {
            steps: 50,
            guidance_scale: 7.5,
            negative_prompt: "low budget, amateur, poor lighting"
        }
    }
    // Add more genres
};

module.exports = genres; 