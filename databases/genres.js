// All Cursor AI generated to be able to get different types of image generation
const genres = {
    anime: {
        suffix: ", anime style art, high quality, detailed character design",
        settings: {
            steps: 35,
            guidance_scale: 7.0,
            negative_prompt: "photorealistic, western art style, low quality"
        }
    },
    realistic: {
        suffix: ", photorealistic, highly detailed, 8k resolution, professional photography",
        settings: {
            steps: 45,
            guidance_scale: 8.0,
            negative_prompt: "cartoon, illustration, anime, drawing, painting"
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
    },
    fantasy: {
        suffix: ", fantasy art style, magical atmosphere, detailed environment",
        settings: {
            steps: 45,
            guidance_scale: 7.5,
            negative_prompt: "realistic, modern, mundane, simple"
        }
    },
    cartoon: {
        suffix: ", cartoon style, vibrant colors, clean lines",
        settings: {
            steps: 30,
            guidance_scale: 7.0,
            negative_prompt: "realistic, photograph, detailed texture"
        }
    },
    digital_art: {
        suffix: ", digital art, detailed illustration, professional artwork",
        settings: {
            steps: 40,
            guidance_scale: 7.5,
            negative_prompt: "photograph, low quality, simple"
        }
    },
    oil_painting: {
        suffix: ", oil painting style, textured canvas, artistic brushstrokes",
        settings: {
            steps: 45,
            guidance_scale: 7.5,
            negative_prompt: "digital art, photograph, smooth texture"
        }
    },
    watercolor: {
        suffix: ", watercolor style, soft edges, flowing colors",
        settings: {
            steps: 35,
            guidance_scale: 7.0,
            negative_prompt: "sharp edges, digital art, photograph"
        }
    },
    pixel_art: {
        suffix: ", pixel art style, retro gaming aesthetic, clear pixels",
        settings: {
            steps: 30,
            guidance_scale: 7.0,
            negative_prompt: "realistic, smooth, high resolution"
        }
    },
    comic: {
        suffix: ", comic book style, bold lines, dynamic composition",
        settings: {
            steps: 35,
            guidance_scale: 7.5,
            negative_prompt: "realistic, photograph, watercolor"
        }
    },
};

module.exports = genres; 