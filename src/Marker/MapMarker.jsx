import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import './MapMarker.css'

// Size configurations for icon anchor points
const sizeConfig = {
    small: { width: 24, height: 32 },
    medium: { width: 32, height: 42 },
    large: { width: 40, height: 52 }
}

// Create custom marker icon using divIcon with CSS classes
const createCustomIcon = (color = 'red', size = 'medium') => {
    const { width, height } = sizeConfig[size] || sizeConfig.medium
    
    return L.divIcon({
        className: `custom-marker marker-${color} marker-${size}`,
        html: `
            <div class="marker-pin">
                <div class="marker-inner"></div>
            </div>
            <div class="marker-shadow"></div>
        `,
        iconSize: [width, height],
        iconAnchor: [width / 2, height],
        popupAnchor: [0, -height + 5]
    })
}

function MapMarker({ 
    position, 
    color = 'red',
    size = 'medium',
    children,
    popupContent,
    ...props 
}) {
    const icon = createCustomIcon(color, size)
    
    return (
        <Marker position={position} icon={icon} {...props}>
            {(children || popupContent) && (
                <Popup className="custom-popup">
                    {children || popupContent}
                </Popup>
            )}
        </Marker>
    )
}

export default MapMarker
