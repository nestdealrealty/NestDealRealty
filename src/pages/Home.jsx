import React from 'react';
import Hero from '../components/Hero';
import PropertySlider from '../components/PropertySlider';
import { builderProperties, bestDeals } from '../data/properties';

const Home = () => {
    return (
        <>
            <Hero />
            <PropertySlider
                title="Builder's Properties"
                properties={builderProperties}
            />
            <PropertySlider
                title="Best Deals"
                properties={bestDeals}
            />
        </>
    );
};

export default Home;
