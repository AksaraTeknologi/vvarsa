import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { className = '', alt = 'App Logo', ...rest } = props;
    return (
        <img 
            src="/images/logo.png" 
            alt={alt} 
            className={`object-contain aspect-square shrink-0 ${className}`}
            {...rest} 
        />
    );
}