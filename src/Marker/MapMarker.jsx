import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MarkerColors } from './markerColors'
import './MapMarker.css'

// Create custom marker icon using divIcon
const createCustomIcon = (color = '#e74c3c', size = 'medium') => {
    const sizes = {
        small: { width: 24, height: 32, fontSize: 12 },
        medium: { width: 32, height: 42, fontSize: 16 },
        large: { width: 40, height: 52, fontSize: 20 }
    }
    
    const { width, height, fontSize } = sizes[size] || sizes.medium
    
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-pin" style="
                --marker-color: ${color};
                --marker-width: ${width}px;
                --marker-height: ${height}px;
                --marker-font-size: ${fontSize}px;
            ">
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
    color = MarkerColors.red, 
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
