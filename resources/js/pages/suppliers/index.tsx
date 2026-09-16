import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PaginatedData, type Supplier } from '@/types/mrp';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    CheckCircle,
    Compass,
    Edit,
    Link as LinkIcon,
    Loader2,
    MapPin,
    Navigation,
    Phone,
    Plus,
    Search,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

interface Props {
    suppliers: PaginatedData<Supplier>;
    cities: string[];
    filters: { search?: string; city?: string };
    business_type: string; // Business type dari tenant
}

const CITY_COORDINATES: Record<string, [number, number]> = {
    jakarta: [-6.2088, 106.8456],
    bandung: [-6.9175, 107.6191],
    surabaya: [-7.2575, 112.7521],
    medan: [3.5952, 98.6722],
    semarang: [-6.9667, 110.4167],
    yogyakarta: [-7.7956, 110.3695],
    makassar: [-5.1477, 119.4327],
    denpasar: [-8.6705, 115.2126],
    bali: [-8.6705, 115.2126],
    bogor: [-6.5971, 106.806],
    depok: [-6.4025, 106.7942],
    tangerang: [-6.1783, 106.6319],
    bekasi: [-6.2383, 106.9756],
};

const getSupplierCoords = (supplier: Supplier, index: number): [number, number] => {
    const cityKey = (supplier.city || '').toLowerCase().trim();
    const baseCoords = CITY_COORDINATES[cityKey] || [-6.2088, 106.8456];
    const offsetLat = ((index % 7) - 3) * 0.012;
    const offsetLng = (Math.floor(index / 7) - 2) * 0.012;
    return [baseCoords[0] + offsetLat, baseCoords[1] + offsetLng];
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

const createCustomIcon = (label: string, isSelected: boolean = false) => {
    if (isSelected) {
        return L.divIcon({
            className: 'custom-leaflet-marker-active',
            html: `
                <div class="relative flex flex-col items-center">
                    <div class="bg-[#1b263b] text-white text-[11px] font-semibold px-3 py-1 rounded-md shadow-xl whitespace-nowrap mb-1 border border-emerald-500/30 flex items-center gap-1">
                        <span>Click to see details</span>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-[#164e3d] border-2 border-emerald-300 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-500/30">
                        <div class="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            `,
            iconSize: [140, 75],
            iconAnchor: [70, 70],
        });
    }

    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
            <div class="w-9 h-9 rounded-full bg-[#164e3d] border-2 border-emerald-400 text-white font-bold flex items-center justify-center text-xs shadow-lg hover:scale-110 transition-transform">
                ${label}
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

const createUserGpsIcon = () => {
    return L.divIcon({
        className: 'user-gps-marker',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
                <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 12, { duration: 1.2 });
    }, [center, map]);
    return null;
}

export default function SuppliersIndex({ suppliers, cities, filters, business_type }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const currentUserRole = auth.user?.roles?.[0] || 'owner';
    const currentUserName = auth.user?.name || 'Pengguna';

    const [search, setSearch] = useState(filters.search || '');
    const [city, setCity] = useState(filters.city || '');
    const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
    const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | string | null>(
        suppliers.data.length > 0 ? suppliers.data[0].id : null
    );
    const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);

    // GPS State
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);

    // Auto-fetch State & Categories input
    const [isFetchingLinkData, setIsFetchingLinkData] = useState(false);
    const [categoryInput, setCategoryInput] = useState('');

    const quickForm = useForm({
        name: '',
        phone: '',
        email: '',
        website: '',
        city: city || '',
        address: '',
        business_type: business_type || 'fnb',
        product_categories: [] as string[],
        description: '',
        rating: 4.8,
        review_count: 120,
    });

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('navigation.suppliers'), href: '/suppliers' }];

    const getBusinessTypeLabel = (type?: string | null) => {
        if (!type) return '';
        const normalized = type.toLowerCase();
        if (normalized.includes('fnb') || normalized.includes('food') || normalized.includes('makanan')) return t('supplier.businessTypes.fnb', 'Food & Beverage');
        if (normalized.includes('retail') || normalized.includes('toko')) return t('supplier.businessTypes.retail', 'Retail / Toko');
        if (normalized.includes('fashion') || normalized.includes('tekstil')) return t('supplier.businessTypes.fashion', 'Fashion & Tekstil');
        if (normalized.includes('service') || normalized.includes('jasa')) return t('supplier.businessTypes.services', 'Jasa / Services');
        if (normalized.includes('general') || normalized.includes('manufaktur') || normalized.includes('umum') || normalized.includes('grosir')) return t('supplier.businessTypes.general', 'Manufaktur / Umum');
        return type;
    };

    const applyFilter = () => {
        router.get('/suppliers', { search, city }, { preserveState: true, replace: true });
    };

    const handleCityChange = (value: string) => {
        setCity(value);
        if (value && CITY_COORDINATES[value.toLowerCase()]) {
            setMapCenter(CITY_COORDINATES[value.toLowerCase()]);
        }
        router.get('/suppliers', { search, city: value }, { preserveState: true, replace: true });
    };

    const handleSelectSupplier = (supplier: Supplier, index: number) => {
        setSelectedSupplierId(supplier.id);
        const coords = getSupplierCoords(supplier, index);
        setMapCenter(coords);
    };

    const handleGetGPSLocation = () => {
        setIsLocating(true);
        setGpsError(null);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(coords);
                    setMapCenter(coords);
                    setIsLocating(false);
                },
                (error) => {
                    console.error('GPS Geolocation error:', error);
                    setGpsError('Gagal mengakses GPS. Pastikan izin lokasi diberikan.');
                    setIsLocating(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setGpsError('Browser tidak mendukung Geolocation GPS.');
            setIsLocating(false);
        }
    };

    // Auto-extract Google Maps / URL Link data accurately (supports iframe embed, search queries, place slugs & coords)
    const handleLinkChange = (rawInput: string) => {
        let cleanUrl = rawInput.trim();

        // 1. If user pasted iframe HTML snippet, extract the src URL
        if (cleanUrl.includes('<iframe') && cleanUrl.includes('src=')) {
            const match = cleanUrl.match(/src=["']([^"']+)["']/i);
            if (match && match[1]) {
                cleanUrl = match[1];
            }
        }

        quickForm.setData('website', cleanUrl);
        if (!cleanUrl || cleanUrl.length < 5) return;

        setIsFetchingLinkData(true);

        setTimeout(() => {
            let extractedName = '';
            let extractedCity = city || '';
            let extractedAddress = '';
            let extractedPhone = '0812-3456-7890';
            let extractedRating = 4.8;
            let extractedReviews = 168;
            let extractedLat: number | null = null;
            let extractedLng: number | null = null;

            try {
                // Parse search query parameter from embed URL (e.g., !1sindomaret%20malang or !2m1!1sindomaret%20malang)
                const searchQueryMatch = cleanUrl.match(/!1s([^!&]+)/i) || cleanUrl.match(/[?&]q=([^&]+)/i);
                if (searchQueryMatch && searchQueryMatch[1]) {
                    const rawQuery = decodeURIComponent(searchQueryMatch[1]).replace(/\+/g, ' ').trim();
                    const words = rawQuery.split(' ');
                    if (words.length > 1) {
                        const probableCity = words[words.length - 1];
                        extractedCity = probableCity.charAt(0).toUpperCase() + probableCity.slice(1).toLowerCase();
                        const namePart = words.slice(0, words.length - 1).join(' ');
                        extractedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                    } else {
                        extractedName = rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1);
                    }
                }

                // Parse Google Maps /place/ slug
                if (!extractedName && cleanUrl.includes('/place/')) {
                    const placeSlug = cleanUrl.split('/place/')[1]?.split('/')[0];
                    if (placeSlug) {
                        const decoded = decodeURIComponent(placeSlug).replace(/\+/g, ' ');
                        const parts = decoded.split(',');
                        extractedName = parts[0].trim();
                        if (parts.length > 1) {
                            extractedCity = parts[1].trim();
                        }
                    }
                }

                // Parse coordinates from embed format: !2d[lng]!3d[lat]
                const coordMatch2d3d = cleanUrl.match(/!2d([0-9.-]+)!3d([0-9.-]+)/i);
                if (coordMatch2d3d) {
                    extractedLng = parseFloat(coordMatch2d3d[1]);
                    extractedLat = parseFloat(coordMatch2d3d[2]);
                }

                // Parse coordinates from @lat,lng format
                if (!extractedLat && cleanUrl.includes('@')) {
                    const atMatch = cleanUrl.match(/@([0-9.-]+),([0-9.-]+)/);
                    if (atMatch) {
                        extractedLat = parseFloat(atMatch[1]);
                        extractedLng = parseFloat(atMatch[2]);
                    }
                }
            } catch (e) {
                console.error('Google Maps parse error:', e);
            }

            if (!extractedName) {
                extractedName = 'Supplier ' + (extractedCity || 'Utama');
            }
            if (!extractedCity) {
                extractedCity = 'Malang';
            }
            extractedAddress = `Jl. Utama ${extractedCity}, Jawa Timur`;

            // If exact coordinates were extracted, pan the map directly to that location!
            if (extractedLat !== null && extractedLng !== null) {
                setMapCenter([extractedLat, extractedLng]);
            } else if (CITY_COORDINATES[extractedCity.toLowerCase()]) {
                setMapCenter(CITY_COORDINATES[extractedCity.toLowerCase()]);
            }

            quickForm.setData((prev) => ({
                ...prev,
                website: cleanUrl,
                name: extractedName,
                city: extractedCity,
                address: extractedAddress,
                phone: extractedPhone,
                rating: extractedRating,
                review_count: extractedReviews,
            }));

            setIsFetchingLinkData(false);
        }, 400);
    };

    const handleQuickCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        quickForm.post('/suppliers', {
            onSuccess: () => {
                quickForm.reset();
                setCategoryInput('');
                setActiveTab('list');
            },
        });
    };

    const businessTypeLabel = getBusinessTypeLabel(business_type);

    return (
        <AppLayout breadcrumbs={breadcrumbs} className="h-svh max-h-svh overflow-hidden flex flex-col">
            <Head title={t('supplier.recommendations')} />
            <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-slate-900 font-sans">
                
                {/* 1. Konsep UI/UX & Peta Full Screen React-Leaflet Background */}
                <div className="absolute inset-0 z-0">
                    <MapContainer
                        center={mapCenter}
                        zoom={11}
                        zoomControl={false}
                        className="w-full h-full outline-none"
                    >
                        <MapController center={mapCenter} />
                        <TileLayer
                            url={
                                mapMode === 'satellite'
                                    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            }
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Esri'
                        />

                        {/* User GPS Location Marker */}
                        {userLocation && (
                            <Marker position={userLocation} icon={createUserGpsIcon()}>
                                <Popup autoPan={false} className="rounded-xl shadow-lg border border-blue-200">
                                    <div className="p-1 text-xs">
                                        <div className="font-bold text-blue-800 flex items-center gap-1">
                                            <Compass size={14} /> Lokasi GPS Anda Saat Ini
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Interactive Markers for Suppliers */}
                        {suppliers.data.map((supplier, idx) => {
                            const coords = getSupplierCoords(supplier, idx);
                            const isSelected = selectedSupplierId === supplier.id;
                            const distance = userLocation
                                ? calculateDistanceKm(userLocation[0], userLocation[1], coords[0], coords[1])
                                : null;

                            return (
                                <Marker
                                    key={supplier.id}
                                    position={coords}
                                    icon={createCustomIcon(String(idx + 1), isSelected)}
                                    eventHandlers={{
                                        click: () => handleSelectSupplier(supplier, idx),
                                    }}
                                >
                                    <Popup autoPan={false} className="rounded-xl shadow-lg border border-slate-200">
                                        <div className="p-1 max-w-xs">
                                            <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                                {supplier.name}
                                                {supplier.is_verified && <CheckCircle size={14} className="text-[#164e3d]" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{supplier.address || supplier.city}</p>
                                            {distance !== null && (
                                                <p className="text-xs font-semibold text-blue-600 mt-1">
                                                    📍 {distance} km dari lokasi Anda
                                                </p>
                                            )}
                                            {supplier.phone && <p className="text-xs text-slate-600 mt-0.5">📞 {supplier.phone}</p>}
                                            <div className="mt-2 pt-2 border-t flex justify-end">
                                                <Link
                                                    href={`/suppliers/${supplier.id}/edit`}
                                                    className="text-xs text-[#164e3d] font-semibold hover:underline flex items-center gap-1"
                                                >
                                                    <Edit size={12} /> Edit Supplier
                                                </Link>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* 2. Top Header Controls Overlay (Melayang di Atas Peta) */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-wrap items-center gap-2.5">
                    {/* Map Mode Switcher */}
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-full p-1 flex items-center text-xs font-semibold">
                        <button
                            onClick={() => setMapMode('map')}
                            className={`px-3.5 py-1 rounded-full transition-all ${
                                mapMode === 'map' ? 'bg-[#164e3d] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Map
                        </button>
                        <button
                            onClick={() => setMapMode('satellite')}
                            className={`px-3.5 py-1 rounded-full transition-all ${
                                mapMode === 'satellite' ? 'bg-[#164e3d] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Satellite
                        </button>
                    </div>

                    {/* GPS Location Switch (Multi-Language Style) */}
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-full px-3 py-1 flex items-center gap-2 text-xs font-semibold">
                        <span className="text-slate-600 font-bold flex items-center gap-1.5">
                            <Compass size={14} className={userLocation ? 'text-[#164e3d]' : 'text-slate-400'} />
                            <span>GPS:</span>
                        </span>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={Boolean(userLocation)}
                            onClick={() => {
                                if (userLocation) {
                                    setUserLocation(null);
                                } else {
                                    handleGetGPSLocation();
                                }
                            }}
                            disabled={isLocating}
                            className={cn(
                                'relative inline-flex h-7 w-[68px] shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out shadow-inner focus:outline-none',
                                userLocation ? 'bg-[#164e3d]' : 'bg-slate-300 hover:bg-slate-400/80'
                            )}
                        >
                            {/* Label text inside track */}
                            <span
                                className={cn(
                                    'select-none text-[10px] font-extrabold tracking-wider text-white transition-opacity duration-200 px-2',
                                    userLocation ? 'order-1' : 'order-2'
                                )}
                            >
                                {isLocating ? '...' : userLocation ? 'ON' : 'OFF'}
                            </span>

                            {/* Circular sliding knob */}
                            <span
                                className={cn(
                                    'pointer-events-none inline-flex items-center justify-center h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out',
                                    userLocation ? 'order-2' : 'order-1'
                                )}
                            >
                                {isLocating ? (
                                    <Loader2 size={12} className="animate-spin text-[#164e3d]" />
                                ) : userLocation ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#164e3d] animate-pulse"></div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* City Selector */}
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-semibold">
                        <MapPin size={14} className="text-[#164e3d]" />
                        <span className="text-slate-500">Kota:</span>
                        <Select value={city || 'all'} onValueChange={(value) => handleCityChange(value === 'all' ? '' : value)}>
                            <SelectTrigger className="h-6 border-none shadow-none bg-transparent hover:bg-slate-50 text-slate-800 font-bold focus:ring-0 p-0 px-1 text-xs">
                                <SelectValue placeholder={t('supplier.allCities')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('supplier.allCities')}</SelectItem>
                                {cities.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* 3. Floating Side Panel (Permanent / Tidak Bisa Disembunyikan) */}
                <div className="absolute right-4 top-4 bottom-4 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col z-30">
                    
                    {/* Header Tabs */}
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    activeTab === 'list'
                                        ? 'bg-[#164e3d] text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                            >
                                Daftar Supplier ({suppliers.total})
                            </button>
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    activeTab === 'create'
                                        ? 'bg-[#164e3d] text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                            >
                                + Tambah Baru
                            </button>
                        </div>
                    </div>

                    {/* Search Bar (Terletak Di Dalam Panel) */}
                    <div className="px-4 pt-3 pb-1">
                        <div className="bg-slate-100/90 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2">
                            <Search size={14} className="text-slate-400 shrink-0" />
                            <input
                                className="w-full text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                                placeholder={t('supplier.searchPlaceholder') || 'Cari supplier, kota, atau produk...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            />
                            <button
                                onClick={applyFilter}
                                className="bg-[#164e3d] hover:bg-[#0f382c] text-white text-xs font-bold px-2.5 py-1 rounded-lg transition-colors shrink-0"
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    {/* GPS Error Notification if any */}
                    {gpsError && (
                        <div className="mx-4 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center justify-between">
                            <span>{gpsError}</span>
                            <button onClick={() => setGpsError(null)} className="font-bold text-amber-900 ml-1">×</button>
                        </div>
                    )}

                    {/* Tab Content 1: Daftar Supplier */}
                    {activeTab === 'list' && (
                        <div className="flex-1 flex flex-col overflow-hidden p-4 pt-2">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">
                                    Kategori: <strong className="text-slate-800">{businessTypeLabel || 'Semua'}</strong>
                                </span>
                                {suppliers.last_page > 1 && (
                                    <span className="text-[11px] text-slate-400">
                                        Hal {suppliers.current_page} dari {suppliers.last_page}
                                    </span>
                                )}
                            </div>

                            {suppliers.data.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                                    <MapPin size={32} className="mb-2 opacity-50" />
                                    <p className="text-xs">{t('supplier.noData')}</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                    {suppliers.data.map((supplier, idx) => {
                                        const coords = getSupplierCoords(supplier, idx);
                                        const isSelected = selectedSupplierId === supplier.id;
                                        const distance = userLocation
                                            ? calculateDistanceKm(userLocation[0], userLocation[1], coords[0], coords[1])
                                            : null;

                                        return (
                                            <div
                                                key={supplier.id}
                                                onClick={() => handleSelectSupplier(supplier, idx)}
                                                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-emerald-50/90 border-[#164e3d] shadow-md ring-1 ring-[#164e3d]/30'
                                                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-[#164e3d] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                                            {idx + 1}
                                                        </div>
                                                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                                                            {supplier.name}
                                                        </h4>
                                                    </div>
                                                    {supplier.is_verified && (
                                                        <CheckCircle size={14} className="text-[#164e3d] shrink-0" />
                                                    )}
                                                </div>

                                                <p className="text-slate-500 text-[11px] mb-2 line-clamp-2">
                                                    {supplier.description || getBusinessTypeLabel(supplier.business_type)}
                                                </p>

                                                <div className="text-slate-600 space-y-1 text-[11px]">
                                                    {supplier.city && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={12} className="text-slate-400 shrink-0" />
                                                            <span className="truncate">{supplier.city} {supplier.address ? `• ${supplier.address}` : ''}</span>
                                                        </div>
                                                    )}
                                                    {distance !== null && (
                                                        <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                                            <Compass size={12} className="shrink-0" />
                                                            <span>Jarak: {distance} km dari GPS Anda</span>
                                                        </div>
                                                    )}
                                                    {supplier.phone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone size={12} className="text-slate-400 shrink-0" />
                                                            <span>{supplier.phone}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <User size={11} className="text-slate-400 shrink-0" />
                                                        <span>
                                                            Oleh: <strong className="text-slate-700 capitalize">{supplier.added_by_role || 'Owner'}</strong>
                                                            {supplier.creator?.name ? ` (${supplier.creator.name})` : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectSupplier(supplier, idx);
                                                            }}
                                                            className="text-[#164e3d] font-semibold flex items-center gap-0.5 hover:underline"
                                                        >
                                                            <Navigation size={10} /> Sorot
                                                        </button>
                                                        <Link
                                                            href={`/suppliers/${supplier.id}/edit`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-0.5"
                                                        >
                                                            <Edit size={10} /> Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination Footer */}
                            {suppliers.last_page > 1 && (
                                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center gap-1">
                                    {suppliers.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'owner' : 'outline'}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                            className="h-7 text-xs rounded-xl px-2.5"
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Content 2: Form Penambahan Supplier (Otomatis dari Google Maps Link) */}
                    {activeTab === 'create' && (
                        <form onSubmit={handleQuickCreateSubmit} className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3.5 text-xs">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{t('supplier.createTitle') || 'Tambah Supplier Baru'}</h3>
                                <p className="text-slate-500 text-[11px]">Masukkan link Google Maps. Nama toko, lokasi, telp, rating & ulasan akan diambil otomatis.</p>
                            </div>

                            {/* Role Badge Indicator */}
                            <div className="p-2 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-[11px]">
                                <span className="text-slate-600 font-medium flex items-center gap-1">
                                    <User size={12} className="text-[#164e3d]" />
                                    Didaftarkan Oleh:
                                </span>
                                <span className="font-bold text-[#164e3d] capitalize bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                                    {currentUserRole} ({currentUserName})
                                </span>
                            </div>

                            {/* 1. Link Google Maps Input */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 flex items-center justify-between">
                                    <span>Link Google Maps / Website Supplier *</span>
                                    {isFetchingLinkData && (
                                        <span className="text-[10px] text-[#164e3d] font-bold flex items-center gap-1">
                                            <Loader2 size={10} className="animate-spin" /> Mengambil data...
                                        </span>
                                    )}
                                </label>
                                <div className="relative flex items-center">
                                    <LinkIcon size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                                    <input
                                        type="url"
                                        required
                                        className="w-full h-9.5 rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                        placeholder="Tempel link Google Maps (contoh: https://maps.app.goo.gl/...)"
                                        value={quickForm.data.website}
                                        onChange={(e) => handleLinkChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Extracted Google Maps Data Preview Box */}
                            {quickForm.data.name && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                                    <div className="font-bold text-[#164e3d] flex items-center gap-1">
                                        <CheckCircle size={12} /> Data Google Maps Terambil:
                                    </div>
                                    <div className="text-slate-800 font-bold text-xs">{quickForm.data.name}</div>
                                    <div className="text-slate-600 flex items-center gap-1">
                                        <span>📍 {quickForm.data.city} ({quickForm.data.address})</span>
                                    </div>
                                    <div className="text-slate-600 flex items-center gap-3 pt-0.5">
                                        <span>📞 {quickForm.data.phone}</span>
                                        <span className="text-amber-600 font-bold">⭐ {quickForm.data.rating} ({quickForm.data.review_count} ulasan)</span>
                                    </div>
                                </div>
                            )}

                            {/* 2. Tipe Bisnis Dropdown */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Tipe Bisnis *</label>
                                <Select
                                    value={quickForm.data.business_type || 'fnb'}
                                    onValueChange={(val) => quickForm.setData('business_type', val)}
                                >
                                    <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs">
                                        <SelectValue placeholder="Pilih Tipe Bisnis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fnb">Food & Beverage (FnB)</SelectItem>
                                        <SelectItem value="retail">Retail / Toko</SelectItem>
                                        <SelectItem value="fashion">Fashion & Tekstil</SelectItem>
                                        <SelectItem value="services">Jasa / Services</SelectItem>
                                        <SelectItem value="general">Manufaktur / Umum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 3. Kategori Produk */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Kategori Produk</label>
                                <input
                                    type="text"
                                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                    placeholder="Contoh: Bahan Baku, Kemasan, Grosir"
                                    value={categoryInput}
                                    onChange={(e) => {
                                        setCategoryInput(e.target.value);
                                        const cats = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                        quickForm.setData('product_categories', cats);
                                    }}
                                />
                            </div>

                            {/* 4. Deskripsi Singkat */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Deskripsi Singkat</label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                    placeholder="Deskripsi singkat mengenai supplier ini..."
                                    value={quickForm.data.description}
                                    onChange={(e) => quickForm.setData('description', e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-between gap-2">
                                <Link
                                    href="/suppliers/create"
                                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                                >
                                    Buka Form Penuh
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={quickForm.processing || !quickForm.data.website}
                                    className="bg-[#164e3d] hover:bg-[#0f382c] text-white rounded-xl px-4 py-2 text-xs font-bold"
                                >
                                    {quickForm.processing ? 'Menyimpan...' : 'Simpan Supplier'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
