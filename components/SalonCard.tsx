import { API_BASE_URL } from '@/features/salons/lib/GetApiBaseURL';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Salon = {
    Name: string;
    Address: string;
};

type SalonCardProps = {
    id: number;
    onPress?: () => void;
};

const SalonCard = ({ id, onPress }: SalonCardProps) => {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalons = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/salon/details`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                const data = await response.json();
                setSalons(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Fetch failed');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSalons();
    }, []);

    if (loading) {
        return (
            <View style={styles.card}>
                <View style={styles.imageSkeleton} />
                <View style={styles.textContainer}>
                    <View style={styles.nameSkeleton} />
                    <View style={styles.addressRow}>
                        <View style={styles.iconSkeleton} />
                        <View style={styles.addressSkeleton} />
                    </View>
                    <View style={styles.distanceSkeleton} />
                </View>
                <View style={styles.buttonSkeleton} />
            </View>
        );
    }

    if (error || salons.length === 0) {
        return (
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={styles.errorText}>{error || 'No salons available'}</Text>
                </View>
            </View>
        );
    }

    const salon = salons[id % salons.length];

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <Image
                source={require("@/assets/images/DowntownHair.jpeg")}
                style={styles.image}
            />

            <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>{salon.Name}</Text>

                <View style={styles.addressRow}>
                    <MaterialIcons name="location-on" size={16} color="#666" style={styles.icon} />
                    <Text style={styles.address} numberOfLines={2}>{salon.Address}</Text>
                </View>

                <Text style={styles.distance}>Distance TBD</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Se tider</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 100,
        position: 'relative',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    imageSkeleton: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
        backgroundColor: '#E0E0E0',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    nameSkeleton: {
        width: 120,
        height: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 4,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    icon: {
        marginRight: 6,
        marginTop: 1,
    },
    iconSkeleton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        marginRight: 6,
        marginTop: 1,
    },
    address: {
        fontSize: 15,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    addressSkeleton: {
        flex: 1,
        height: 16,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginLeft: 6,
    },
    distance: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
        marginTop: 2,
    },
    distanceSkeleton: {
        width: 60,
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginTop: 2,
    },
    button: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: '#18AE9F',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSkeleton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 80,
        height: 32,
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    errorText: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
        flex: 1,
    },
});

export default SalonCard;
