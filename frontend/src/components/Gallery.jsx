import React from "react";

const ImageGallery = () => {
    const images = [
        {
            id: 1,
            src: "../../images/24341-1_page-0001.jpg",
            alt: "Photo by Minh Pham",
            category: "Traditional",
        },
        {
            id: 2,
            src: "../../images/19491_pages-to-jpg-0001.jpg",
            alt: "Photo by Magicle",
            category: "Kalamkari",
        },
        {
            id: 3,
            src: "../../images/19491_pages-to-jpg-0002.jpg",
            alt: "Photo by Martin Sanchez",
            category: "Kanjivaram",
        },
        {
            id: 4,
            src: "../../images/19491_pages-to-jpg-0002.jpg",
            alt: "Photo by Lorenzo Herrera",
            category: "Benarsi",
        },
        {
            id: 5,
            src: "../../images/19491_pages-to-jpg-0002.jpg",
            alt: "Photo by Maxime",
            category: "Nature",
        },
        {
            id: 6,
            src: "../../images/24341-1_page-0006.jpg",
            alt: "Photo by Joshua Earle",
            category: "Silk",
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 min-h-screen py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
                    <div className="flex items-center gap-12">
                        <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">
                            Gallery
                        </h2>
                        <p className="hidden max-w-screen-sm text-gray-500 dark:text-gray-300 md:block">
                            A collection of stunning images across different categories.
                        </p>
                    </div>
                </div>

                {/* Image Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className="relative group">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-64 object-contain rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                                    {image.category}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;