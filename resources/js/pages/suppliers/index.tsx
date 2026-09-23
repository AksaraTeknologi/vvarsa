import DeleteConfirmDialog from '@/components/delete-dialog';
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
    Trash2,
    User
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

interface Props {
    suppliers: Supplier[] | PaginatedData<Supplier>;
    all_suppliers?: Supplier[];
    cities: string[];
    filters: { search?: string; city?: string };
    business_type: string;
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
    malang: [-7.9666, 112.6326],
    jember: [-8.1721, 113.6995],
    surakarta: [-7.5755, 110.8243],
    solo: [-7.5755, 110.8243],
    sidoarjo: [-7.4478, 112.7183],
    gresik: [-7.1566, 112.6555],
    kediri: [-7.848, 112.0178],
    blitar: [-8.0983, 112.1681],
    pasuruan: [-7.6453, 112.9075],
    probolinggo: [-7.7543, 113.2159],
    batu: [-7.8671, 112.5239],
};

const getRoleColor = (role?: string | null) => {
    const normalized = (role || 'owner').toLowerCase().trim();
    if (normalized.includes('admin')) {
        return {
            name: 'admin',
            label: 'Admin',
            bg: '#7c3aed',
            border: '#c084fc',
            glow: 'rgba(124, 58, 237, 0.5)',
            colorName: 'Ungu',
        };
    }
    if (normalized.includes('owner')) {
        return {
            name: 'owner',
            label: 'Owner',
            bg: '#16a34a',
            border: '#4ade80',
            glow: 'rgba(22, 163, 74, 0.5)',
            colorName: 'Hijau',
        };
    }
    if (normalized.includes('supervisor') || normalized.includes('supervicor')) {
        return {
            name: 'supervisor',
            label: 'Supervisor',
            bg: '#2563eb',
            border: '#60a5fa',
            glow: 'rgba(37, 99, 235, 0.5)',
            colorName: 'Biru',
        };
    }
    if (normalized.includes('staff')) {
        return {
            name: 'staff',
            label: 'Staff',
            bg: '#db2777',
            border: '#f472b6',
            glow: 'rgba(219, 39, 119, 0.5)',
            colorName: 'Pink',
        };
    }
    return {
        name: 'owner',
        label: 'Owner',
        bg: '#16a34a',
        border: '#4ade80',
        glow: 'rgba(22, 163, 74, 0.5)',
        colorName: 'Hijau',
    };
};

const getSupplierCoords = (supplier: Supplier, index: number): [number, number] => {
    if (supplier.latitude !== undefined && supplier.latitude !== null && supplier.longitude !== undefined && supplier.longitude !== null) {
        return [Number(supplier.latitude), Number(supplier.longitude)];
    }
    const cityKey = (supplier.city || '').toLowerCase().trim();
    const baseCoords = CITY_COORDINATES[cityKey] || [-6.2088, 106.8456];
    const offsetLat = ((index % 7) - 3) * -0.012;
    const offsetLng = (Math.floor(index / 7) - 2) * -0.012;
    return [baseCoords[0] + offsetLat, baseCoords[1] + offsetLng];
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
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

const createCustomIcon = (label: string, isSelected: boolean = false, role?: string | null) => {
    const roleInfo = getRoleColor(role);

    if (isSelected) {
        return L.divIcon({
            className: 'custom-leaflet-marker-active',
            html: `
                <div class="relative flex flex-col items-center group cursor-pointer filter drop-shadow-2xl">
                    <div class="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-2xl whitespace-nowrap mb-1 border border-slate-700 flex items-center gap-1.5 animate-bounce">
                        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${roleInfo.bg};"></span>
                        <span>${label} (${roleInfo.label})</span>
                    </div>
                    <div class="w-11 h-14 relative flex items-center justify-center">
                        <svg viewBox="0 0 32 42" class="w-full h-full">
                            <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26c0-8.84-7.16-16-16-16z" fill="${roleInfo.bg}" stroke="${roleInfo.border}" stroke-width="2"/>
                            <circle cx="16" cy="15" r="7.5" fill="#ffffff"/>
                        </svg>
                        <span class="absolute top-[8px] text-[10px] font-black" style="color: ${roleInfo.bg}; font-family: sans-serif;">
                            ${label}
                        </span>
                    </div>
                </div>
            `,
            iconSize: [140, 80],
            iconAnchor: [70, 75],
        });
    }

    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
            <div class="relative flex flex-col items-center group cursor-pointer filter drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-110">
                <div class="w-9 h-12 relative flex items-center justify-center">
                    <svg viewBox="0 0 32 42" class="w-full h-full">
                        <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26c0-8.84-7.16-16-16-16z" fill="${roleInfo.bg}" stroke="${roleInfo.border}" stroke-width="1.5"/>
                        <circle cx="16" cy="15" r="7" fill="#ffffff"/>
                    </svg>
                    <span class="absolute top-[7px] text-[9px] font-black" style="color: ${roleInfo.bg}; font-family: sans-serif;">
                        ${label}
                    </span>
                </div>
            </div>
        `,
        iconSize: [36, 48],
        iconAnchor: [18, 46],
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
        if (!center || !center[0] || !center[1]) return;

        map.flyTo(center, 13, { duration: 1.0 });

        const timer = setTimeout(() => {
            const isDesktop = window.innerWidth >= 768;
            if (isDesktop) {
                map.panBy([220, -120], { animate: true, duration: 0.5 });
            }
        }, 1100);

        return () => clearTimeout(timer);
    }, [center, map]);
    return null;
}

export default function SuppliersIndex({ suppliers, all_suppliers, cities, filters, business_type }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const currentUserRole = auth.user?.roles?.[0] || 'owner';
    const currentUserName = auth.user?.name || 'Pengguna';

    const rawList: Supplier[] = Array.isArray(suppliers)
        ? suppliers
        : (suppliers?.data ?? all_suppliers ?? []);

    const [search, setSearch] = useState(filters.search || '');
    const [city, setCity] = useState(filters.city || '');
    const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
    const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
    const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);

    // GPS State
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);

    const sortedSuppliersList = useMemo(() => {
        const list = [...rawList];
        if (userLocation) {
            return list.sort((a, b) => {
                const coordsA = getSupplierCoords(a, 0);
                const coordsB = getSupplierCoords(b, 0);
                const distA = calculateDistanceKm(userLocation[0], userLocation[1], coordsA[0], coordsA[1]);
                const distB = calculateDistanceKm(userLocation[0], userLocation[1], coordsB[0], coordsB[1]);
                return distA - distB;
            });
        }
        return list;
    }, [rawList, userLocation]);

    const [selectedSupplierId, setSelectedSupplierId] = useState<number | string | null>(
        sortedSuppliersList.length > 0 ? sortedSuppliersList[0].id : null
    );

    const canManageSupplier = (supplier: Supplier) => {
        const userRoles = auth.user?.roles || [];
        const isUserAdmin = userRoles.includes('admin') || userRoles.includes('Platform Admin') || currentUserRole === 'admin';
        if (isUserAdmin) return true;
        return Boolean(supplier.created_by_user_id && auth.user?.id && String(supplier.created_by_user_id) === String(auth.user.id));
    };

    const handleDeleteSupplier = (supplier: Supplier) => {
        router.delete(`/suppliers/${supplier.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedSupplierId === supplier.id) {
                    setSelectedSupplierId(null);
                }
            },
        });
    };

    // Auto-fetch State & Categories input (Quick Add)
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
        latitude: null as number | null,
        longitude: null as number | null,
    });

    // Inline Edit State
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [isFetchingEditLinkData, setIsFetchingEditLinkData] = useState(false);
    const [editCategoryInput, setEditCategoryInput] = useState('');

    const editForm = useForm({
        name: '',
        phone: '',
        email: '',
        website: '',
        city: city || '',
        address: '',
        business_type: 'fnb',
        product_categories: [] as string[],
        description: '',
        rating: 4.8,
        review_count: 120,
        latitude: null as number | null,
        longitude: null as number | null,
    });

    const handleStartEditSupplier = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        const cats = Array.isArray(supplier.product_categories) ? supplier.product_categories : [];
        editForm.setData({
            name: supplier.name || '',
            phone: supplier.phone || '',
            email: supplier.email || '',
            website: supplier.website || '',
            city: supplier.city || '',
            address: supplier.address || '',
            business_type: supplier.business_type || 'fnb',
            product_categories: cats,
            description: supplier.description || '',
            rating: supplier.rating ?? 4.8,
            review_count: supplier.review_count ?? 120,
            latitude: supplier.latitude ? Number(supplier.latitude) : null,
            longitude: supplier.longitude ? Number(supplier.longitude) : null,
        });
        setEditCategoryInput(cats.join(', '));
        setActiveTab('edit');
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSupplier) return;
        editForm.put(`/suppliers/${editingSupplier.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                editForm.reset();
                setEditingSupplier(null);
                setActiveTab('list');
            },
        });
    };

    const handleEditLinkChange = (rawUrl: string) => {
        editForm.setData('website', rawUrl);
        if (!rawUrl) return;

        setIsFetchingEditLinkData(true);
        fetch('/suppliers/parse-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({ url: rawUrl }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success && result.data) {
                    const scraped = result.data;
                    editForm.setData((prev) => ({
                        ...prev,
                        name: scraped.name || prev.name,
                        city: scraped.city || prev.city,
                        address: scraped.address || prev.address,
                        phone: scraped.phone || prev.phone,
                        website: scraped.website || prev.website || rawUrl,
                        rating: scraped.rating !== undefined ? scraped.rating : prev.rating,
                        review_count: scraped.review_count !== undefined ? scraped.review_count : prev.review_count,
                        latitude: scraped.latitude || prev.latitude,
                        longitude: scraped.longitude || prev.longitude,
                    }));
                }
            })
            .catch((err) => console.error('Gagal parse link edit:', err))
            .finally(() => setIsFetchingEditLinkData(false));
    };

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

    useEffect(() => {
        handleGetGPSLocation();
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleLinkChange = (rawInput: string) => {
        let cleanUrl = rawInput.trim();
        if (!cleanUrl) return;

        if (cleanUrl.includes('<iframe') && cleanUrl.includes('src=')) {
            const match = cleanUrl.match(/src=["']([^"']+)["']/i);
            if (match && match[1]) {
                cleanUrl = match[1];
            }
        } else {
            const urlMatch = cleanUrl.match(/(https?:\/\/[^\s"'<>]+)/i);
            if (urlMatch && urlMatch[1]) {
                cleanUrl = urlMatch[1];
            }
        }

        quickForm.setData('website', cleanUrl);
        if (cleanUrl.length < 5) return;

        setIsFetchingLinkData(true);

        const getCsrfToken = () => {
            const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
            if (metaTag?.content) return metaTag.content;
            const match = document.cookie.match(new RegExp('(^|; )XSRF-TOKEN=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : '';
        };

        const csrfToken = getCsrfToken();

        fetch('/suppliers/parse-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
                'X-XSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ url: rawInput }),
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData.success && resData.data) {
                    const d = resData.data;
                    const name = d.name || 'Supplier Utama';
                    const cityName = d.city || city || 'Malang';
                    const addressStr = d.address || `Jl. Utama ${cityName}, Jawa Timur`;
                    const phoneStr = d.phone || '0812-3456-7890';
                    const ratingVal = d.rating ?? 4.8;
                    const reviewVal = d.review_count ?? 120;
                    const latVal = d.lat !== null && d.lat !== undefined ? d.lat : quickForm.data.latitude;
                    const lngVal = d.lng !== null && d.lng !== undefined ? d.lng : quickForm.data.longitude;

                    quickForm.setData({
                        ...quickForm.data,
                        website: cleanUrl,
                        name: name,
                        city: cityName,
                        address: addressStr,
                        phone: phoneStr,
                        rating: ratingVal,
                        review_count: reviewVal,
                        latitude: latVal,
                        longitude: lngVal,
                    });

                    if (d.lat !== null && d.lng !== null && d.lat !== undefined && d.lng !== undefined) {
                        setMapCenter([d.lat, d.lng]);
                    } else if (CITY_COORDINATES[cityName.toLowerCase()]) {
                        setMapCenter(CITY_COORDINATES[cityName.toLowerCase()]);
                    }
                }
            })
            .catch(() => {
                let extractedName = '';
                let extractedCity = city || 'Malang';
                let extractedAddress = '';
                let extractedPhone = '0812-3456-7890';
                let extractedRating = 4.8;
                let extractedReviews = 168;
                let extractedLat: number | null = null;
                let extractedLng: number | null = null;

                const coordMatch = cleanUrl.match(/!2d([0-9.-]+)!3d([0-9.-]+)/i);
                if (coordMatch) {
                    extractedLng = parseFloat(coordMatch[1]);
                    extractedLat = parseFloat(coordMatch[2]);
                } else {
                    const atMatch = cleanUrl.match(/@([0-9.-]+),([0-9.-]+)/);
                    if (atMatch) {
                        extractedLat = parseFloat(atMatch[1]);
                        extractedLng = parseFloat(atMatch[2]);
                    }
                }

                const embedNameMatch = cleanUrl.match(/!2s([^!&]+)/i);
                if (embedNameMatch && embedNameMatch[1]) {
                    extractedName = decodeURIComponent(embedNameMatch[1]).replace(/\+/g, ' ').trim();
                }

                if (!extractedName && cleanUrl.includes('/place/')) {
                    const placeSlug = cleanUrl.split('/place/')[1]?.split('/')[0];
                    if (placeSlug) {
                        extractedName = decodeURIComponent(placeSlug).replace(/\+/g, ' ').split(',')[0].trim();
                    }
                }

                if (!extractedName) {
                    extractedName = 'Supplier ' + (extractedCity || 'Utama');
                }

                quickForm.setData({
                    ...quickForm.data,
                    website: cleanUrl,
                    name: extractedName,
                    city: extractedCity,
                    address: extractedAddress || `Jl. Utama ${extractedCity}, Jawa Timur`,
                    phone: extractedPhone,
                    rating: extractedRating,
                    review_count: extractedReviews,
                    latitude: extractedLat,
                    longitude: extractedLng,
                });
            })
            .finally(() => {
                setIsFetchingLinkData(false);
            });
    };

    const handleQuickCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        quickForm.post('/suppliers', {
            preserveScroll: true,
            onSuccess: () => {
                quickForm.reset();
                setCategoryInput('');
                setActiveTab('list');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} className="h-svh max-h-svh overflow-hidden flex flex-col">
            <Head title={t('supplier.recommendations')} />
            <div className="supplier-page relative w-full flex-1 min-h-0 overflow-hidden bg-slate-900 font-sans">

                {/* 1. Map Container */}
                <div className="absolute inset-0 z-0">
                    <MapContainer
                        center={mapCenter}
                        zoom={14}
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
                        {sortedSuppliersList.map((supplier, idx) => {
                            const coords = getSupplierCoords(supplier, idx);
                            const isSelected = selectedSupplierId === supplier.id;
                            const distance = userLocation
                                ? calculateDistanceKm(userLocation[0], userLocation[1], coords[0], coords[1])
                                : null;
                            const roleInfo = getRoleColor(supplier.added_by_role);

                            return (
                                <Marker
                                    key={supplier.id}
                                    position={coords}
                                    icon={createCustomIcon(String(idx + 1), isSelected, supplier.added_by_role)}
                                    eventHandlers={{
                                        click: () => handleSelectSupplier(supplier, idx),
                                    }}
                                >
                                     <Popup autoPan={false} className="rounded-xl shadow-lg border border-slate-200">
                                        <div className="p-1 max-w-xs">
                                            <div className="font-bold text-slate-800 text-sm flex items-center justify-between gap-1.5">
                                                <span className="flex items-center gap-1.5 truncate">
                                                    {supplier.name}
                                                    {supplier.is_verified && <CheckCircle size={14} className="text-[#164e3d] shrink-0" />}
                                                </span>
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ring-1 ring-slate-200 inline-block" style={{ backgroundColor: roleInfo.bg }} title={`Dibuat oleh role ${roleInfo.label}`} />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{supplier.address || supplier.city}</p>

                                            {/* Role Creator Badge */}
                                            <div className="mt-2 flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase shadow-sm" style={{ backgroundColor: roleInfo.bg }}>
                                                    {roleInfo.label}
                                                </span>
                                                {supplier.creator?.name && (
                                                    <span className="text-[11px] text-slate-500">by {supplier.creator.name}</span>
                                                )}
                                            </div>

                                            {distance !== null && (
                                                <p className="text-xs font-semibold text-blue-600 mt-1.5">
                                                    📍 {distance} km dari lokasi Anda
                                                </p>
                                            )}
                                            {supplier.phone && <p className="text-xs text-slate-600 mt-0.5">📞 {supplier.phone}</p>}
                                            {canManageSupplier(supplier) && (
                                                <div className="mt-2 pt-2 border-t flex items-center justify-end gap-2 text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStartEditSupplier(supplier);
                                                        }}
                                                        className="text-[#164e3d] font-semibold hover:underline flex items-center gap-1"
                                                    >
                                                        <Edit size={12} /> Edit
                                                    </button>
                                                    <DeleteConfirmDialog
                                                        trigger={
                                                            <button className="text-red-600 font-semibold hover:underline flex items-center gap-1">
                                                                <Trash2 size={12} /> Hapus
                                                            </button>
                                                        }
                                                        title="Hapus Tempat / Supplier"
                                                        itemName={supplier.name}
                                                        onConfirm={() => handleDeleteSupplier(supplier)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* Live Preview Pin for Newly Parsed / Draft Supplier */}
                        {quickForm.data.latitude !== null && quickForm.data.longitude !== null && (
                            <Marker
                                position={[quickForm.data.latitude, quickForm.data.longitude]}
                                icon={createCustomIcon('NEW', true, currentUserRole)}
                            >
                                <Popup autoPan={false} className="rounded-xl shadow-lg border border-purple-200">
                                    <div className="p-1 max-w-xs">
                                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                            📍 {quickForm.data.name || 'Supplier Baru'} (Preview)
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{quickForm.data.address || quickForm.data.city}</p>
                                        <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase shadow-sm" style={{ backgroundColor: getRoleColor(currentUserRole).bg }}>
                                            Role Anda: {getRoleColor(currentUserRole).label} ({getRoleColor(currentUserRole).colorName})
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                {/* 2. Top Header Controls Overlay */}
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

                    {/* GPS Location Switch */}
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
                            <span
                                className={cn(
                                    'select-none text-[10px] font-extrabold tracking-wider text-white transition-opacity duration-200 px-2',
                                    userLocation ? 'order-1' : 'order-2'
                                )}
                            >
                                {isLocating ? '...' : userLocation ? 'ON' : 'OFF'}
                            </span>

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

                    {/* Filter Kota Selector */}
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-full px-3.5 py-1 flex items-center gap-2 text-xs font-semibold">
                        <MapPin size={14} className="text-[#164e3d]" />
                        <span className="text-slate-600 font-bold">Kota:</span>
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

                {/* 3. Floating Side Panel */}
                <div className="supplier-panel absolute right-4 top-4 bottom-4 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col z-30">

                    {/* Header Tabs (Switches between List, Create, and Edit without full page reload) */}
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                    activeTab === 'list'
                                        ? 'bg-[#164e3d] text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                            >
                                Daftar ({sortedSuppliersList.length})
                            </button>
                            <button
                                onClick={() => {
                                    quickForm.reset();
                                    setCategoryInput('');
                                    setActiveTab('create');
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                    activeTab === 'create'
                                        ? 'bg-[#164e3d] text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-200/60'
                                }`}
                            >
                                + Tambah Baru
                            </button>
                            {editingSupplier && (
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                                        activeTab === 'edit'
                                            ? 'bg-[#164e3d] text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                >
                                    <Edit size={11} /> Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Bar */}
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
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                            {sortedSuppliersList.length === 0 ? (
                                <div className="text-center py-12 px-4 space-y-3">
                                    <MapPin size={32} className="mx-auto text-slate-300" />
                                    <p className="text-xs text-slate-500 font-medium">Tidak ada supplier ditemukan untuk kriteria pencarian/lokasi ini.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedSuppliersList.map((supplier, idx) => {
                                        const isSelected = selectedSupplierId === supplier.id;
                                        const roleInfo = getRoleColor(supplier.added_by_role);
                                        const canManage = canManageSupplier(supplier);
                                        const coords = getSupplierCoords(supplier, idx);
                                        const distance = userLocation ? calculateDistanceKm(userLocation[0], userLocation[1], coords[0], coords[1]) : null;

                                        return (
                                            <div
                                                key={supplier.id}
                                                onClick={() => handleSelectSupplier(supplier, idx)}
                                                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                                                    isSelected
                                                        ? 'bg-slate-50/90 border-[#164e3d] shadow-md ring-1 ring-[#164e3d]/20'
                                                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                        <span
                                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 shadow-sm"
                                                            style={{ backgroundColor: roleInfo.bg }}
                                                        >
                                                            {idx + 1}
                                                        </span>
                                                        <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-[#164e3d]">
                                                            {supplier.name}
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm inline-block"
                                                            style={{ backgroundColor: roleInfo.bg }}
                                                            title={`Dibuat oleh role ${roleInfo.label} (${roleInfo.colorName})`}
                                                        />
                                                        {supplier.is_verified && (
                                                            <CheckCircle size={14} className="text-[#164e3d] shrink-0" />
                                                        )}
                                                    </div>
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
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm inline-block"
                                                            style={{ backgroundColor: roleInfo.bg }}
                                                        />
                                                        <span>
                                                            Oleh: <strong className="capitalize" style={{ color: roleInfo.bg }}>{roleInfo.label}</strong>
                                                            {supplier.creator?.name ? ` (${supplier.creator.name})` : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectSupplier(supplier, idx);
                                                            }}
                                                            className="text-[#164e3d] font-semibold flex items-center gap-0.5 hover:underline"
                                                        >
                                                            <Navigation size={10} /> Sorot
                                                        </button>
                                                        {canManage ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStartEditSupplier(supplier);
                                                                    }}
                                                                    className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-0.5 hover:underline"
                                                                >
                                                                    <Edit size={10} /> Edit
                                                                </button>
                                                                <div onClick={(e) => e.stopPropagation()}>
                                                                    <DeleteConfirmDialog
                                                                        trigger={
                                                                            <button
                                                                                type="button"
                                                                                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-0.5"
                                                                            >
                                                                                <Trash2 size={10} /> Hapus
                                                                            </button>
                                                                        }
                                                                        title="Hapus Tempat / Supplier"
                                                                        itemName={supplier.name}
                                                                        onConfirm={() => handleDeleteSupplier(supplier)}
                                                                    />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400 text-[9px] italic" title="Hanya pembuat tempat ini atau Admin yang dapat mengedit/menghapus">
                                                                Read-only
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Content 2: Form Penambahan Supplier (State SPA tanpa reload) */}
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

                            {/* Link Google Maps Input */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 flex items-center justify-between">
                                    <span>Link Google Maps / Website Supplier *</span>
                                    {isFetchingLinkData && (
                                        <span className="text-[10px] text-[#164e3d] font-bold flex items-center gap-1">
                                            <Loader2 size={10} className="animate-spin" /> Mengambil data...
                                        </span>
                                    )}
                                </label>
                                <div className="relative flex items-start">
                                    <LinkIcon size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                                    <textarea
                                        rows={2}
                                        required
                                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                        placeholder="Tempel link Google Maps, kode embed iframe, atau teks detail tempat..."
                                        value={quickForm.data.website}
                                        onChange={(e) => handleLinkChange(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleLinkChange(quickForm.data.website)}
                                        disabled={isFetchingLinkData || !quickForm.data.website}
                                        className="text-[11px] bg-[#164e3d] hover:bg-[#0f382c] disabled:opacity-50 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all"
                                    >
                                        {isFetchingLinkData ? (
                                            <>
                                                <Loader2 size={11} className="animate-spin" />
                                                <span>Mengambil Data...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span> Extract / Ambil Data Link</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Extracted Google Maps Data Editable Form Box */}
                            {quickForm.data.name && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-[11px]">
                                    <div className="font-bold text-[#164e3d] flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle size={12} /> Data Terambil (Dapat Disesuaikan):
                                        </span>
                                    </div>

                                    {/* Nama Supplier */}
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-700">Nama Supplier *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                            value={quickForm.data.name}
                                            onChange={(e) => quickForm.setData('name', e.target.value)}
                                        />
                                    </div>

                                    {/* Kota & Telepon Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="font-semibold text-slate-700">Kota</label>
                                            <input
                                                type="text"
                                                className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                                value={quickForm.data.city}
                                                onChange={(e) => quickForm.setData('city', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-semibold text-slate-700">No. Telepon</label>
                                            <input
                                                type="text"
                                                className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                                value={quickForm.data.phone}
                                                onChange={(e) => quickForm.setData('phone', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Alamat Lengkap */}
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-700">Alamat Lengkap</label>
                                        <input
                                            type="text"
                                            className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                            value={quickForm.data.address}
                                            onChange={(e) => quickForm.setData('address', e.target.value)}
                                        />
                                    </div>

                                    {/* Rating & Ulasan Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="font-semibold text-slate-700">Rating ⭐ (0 - 5)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                                value={quickForm.data.rating}
                                                onChange={(e) => quickForm.setData('rating', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-semibold text-slate-700">Jumlah Ulasan 💬</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                                value={quickForm.data.review_count}
                                                onChange={(e) => quickForm.setData('review_count', parseInt(e.target.value, 10) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tipe Bisnis Dropdown */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Tipe Bisnis *</label>
                                <Select
                                    value={quickForm.data.business_type || 'fnb'}
                                    onValueChange={(val) => quickForm.setData('business_type', val)}
                                >
                                    <SelectTrigger className="admin-business-type-select h-9 rounded-xl border-slate-200 text-xs">
                                        <SelectValue placeholder="Pilih Tipe Bisnis" />
                                    </SelectTrigger>
                                    <SelectContent className="admin-business-type-options">
                                        <SelectItem value="fnb">Food & Beverage (FnB)</SelectItem>
                                        <SelectItem value="retail">Retail / Toko</SelectItem>
                                        <SelectItem value="fashion">Fashion & Tekstil</SelectItem>
                                        <SelectItem value="services">Jasa / Services</SelectItem>
                                        <SelectItem value="general">Manufaktur / Umum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kategori Produk */}
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

                            {/* Deskripsi Singkat */}
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
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('list')}
                                    className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium"
                                >
                                    Batal
                                </button>
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

                    {/* Tab Content 3: Form Edit Supplier (State SPA tanpa reload) */}
                    {activeTab === 'edit' && editingSupplier && (
                        <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3.5 text-xs">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Edit Supplier / Tempat</h3>
                                <p className="text-slate-500 text-[11px]">Perbarui informasi tempat, alamat, telp, rating, & link Google Maps.</p>
                            </div>

                            {/* Role Badge Indicator */}
                            <div className="p-2 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-[11px]">
                                <span className="text-slate-600 font-medium flex items-center gap-1">
                                    <User size={12} className="text-[#164e3d]" />
                                    Pembuat Tempat:
                                </span>
                                <span className="font-bold text-[#164e3d] capitalize bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                                    {editingSupplier.added_by_role || 'Owner'} {editingSupplier.creator?.name ? `(${editingSupplier.creator.name})` : ''}
                                </span>
                            </div>

                            {/* Link Google Maps Input for Edit */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700 flex items-center justify-between">
                                    <span>Link Google Maps / Website Supplier</span>
                                    {isFetchingEditLinkData && (
                                        <span className="text-[10px] text-[#164e3d] font-bold flex items-center gap-1">
                                            <Loader2 size={10} className="animate-spin" /> Mengambil data...
                                        </span>
                                    )}
                                </label>
                                <div className="relative flex items-start">
                                    <LinkIcon size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                                    <textarea
                                        rows={2}
                                        className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                        placeholder="Tempel link Google Maps atau kode embed..."
                                        value={editForm.data.website}
                                        onChange={(e) => handleEditLinkChange(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleEditLinkChange(editForm.data.website)}
                                        disabled={isFetchingEditLinkData || !editForm.data.website}
                                        className="text-[11px] bg-[#164e3d] hover:bg-[#0f382c] disabled:opacity-50 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all"
                                    >
                                        {isFetchingEditLinkData ? (
                                            <>
                                                <Loader2 size={11} className="animate-spin" />
                                                <span>Mengambil Data...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Extract / Ambil Data Link</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Extracted / Editable Form Data Box */}
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-[11px]">
                                {/* Nama Supplier */}
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Nama Supplier *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                </div>

                                {/* Kota & Telepon Grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-700">Kota</label>
                                        <input
                                            type="text"
                                            className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                            value={editForm.data.city}
                                            onChange={(e) => editForm.setData('city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-700">No. Telepon</label>
                                        <input
                                            type="text"
                                            className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                            value={editForm.data.phone}
                                            onChange={(e) => editForm.setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Alamat Lengkap */}
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Alamat Lengkap</label>
                                    <input
                                        type="text"
                                        className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                        value={editForm.data.address}
                                        onChange={(e) => editForm.setData('address', e.target.value)}
                                    />
                                </div>

                                {/* Rating & Ulasan Grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-700">Rating ⭐ (0 - 5)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                            value={editForm.data.rating}
                                            onChange={(e) => editForm.setData('rating', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-slate-700">Jumlah Ulasan 💬</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs bg-white outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                            value={editForm.data.review_count}
                                            onChange={(e) => editForm.setData('review_count', parseInt(e.target.value, 10) || 0)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tipe Bisnis Dropdown */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Tipe Bisnis *</label>
                                <Select
                                    value={editForm.data.business_type || 'fnb'}
                                    onValueChange={(val) => editForm.setData('business_type', val)}
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

                            {/* Kategori Produk */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Kategori Produk</label>
                                <input
                                    type="text"
                                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                    placeholder="Contoh: Bahan Baku, Kemasan, Grosir"
                                    value={editCategoryInput}
                                    onChange={(e) => {
                                        setEditCategoryInput(e.target.value);
                                        const cats = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                        editForm.setData('product_categories', cats);
                                    }}
                                />
                            </div>

                            {/* Deskripsi Singkat */}
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Deskripsi Singkat</label>
                                <textarea
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#164e3d] focus:ring-1 focus:ring-[#164e3d]"
                                    placeholder="Deskripsi singkat mengenai supplier ini..."
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('list')}
                                    className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium"
                                >
                                    Batal
                                </button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-[#164e3d] hover:bg-[#0f382c] text-white rounded-xl px-4 py-2 text-xs font-bold"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* GPS Mandatory Overlay Modal */}
            {!userLocation && (
                <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 max-w-md w-full text-center text-white space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
                            <Compass size={32} className={isLocating ? 'animate-spin' : ''} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">Izin Akses GPS Diperlukan</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Untuk mengakses halaman supplier dan peta interaktif, Anda wajib mengaktifkan GPS / izin lokasi pada perangkat Anda.
                            </p>
                        </div>

                        {gpsError && (
                            <div className="bg-amber-950/80 border border-amber-700/50 text-amber-200 text-xs p-3 rounded-xl font-medium flex items-center gap-2 text-left">
                                <span className="text-base">⚠️</span>
                                <span>{gpsError}</span>
                            </div>
                        )}

                        <Button
                            onClick={handleGetGPSLocation}
                            disabled={isLocating}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            {isLocating ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Mengakses Lokasi GPS...</span>
                                </>
                            ) : (
                                <>
                                    <Navigation size={16} />
                                    <span>Aktifkan & Izinkan GPS</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
