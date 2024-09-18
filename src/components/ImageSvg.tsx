import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SvgFromUrlProps {
    url: string;
    width: number;
    height: number;
    viewBox?: string;
}

const SvgFromUrl: React.FC<SvgFromUrlProps> = ({ url, width, height, viewBox = '0 0 100 100' }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch SVG: ${response.statusText}`);
                }
                const svgData = await response.text();
                setSvgContent(svgData);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <Svg width={width} height={height} viewBox={viewBox}>
            <Path d={svgContent!} fill="black" />
        </Svg>
    );
};

export default SvgFromUrl;