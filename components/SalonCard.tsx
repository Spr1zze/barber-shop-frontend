import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// 4 predefined salons
const SalonLocation = [
    {
        name: "Downtown Hair",
        address: "Nørre Gade 14",
        distance: "800 m",
        Image: require("@/assets/images/DowntownHair.jpeg")
    },
    {
        name: "Style House",
        address: "Frederiksborrgade 27",
        distance: "1.4 km",
        Image: require("@/assets/images/StyleHouse.jpg")
    },
    {
        name: "Bella Salon",
        address: "Østerbrogade 56",
        distance: "1.7 km",
        Image: require("@/assets/images/BellaSalon.jpg")
    },
    {
        name: "Trendy Cuts",
        address: "Gammel kongevej 22",
        distance: "2.5 km",
        Image: require("@/assets/images/TrendyCuts.jpg")
    }
];

const SalonCard = ({
    id = 0,

    onPress = () => console.log('Book salon')
}) => {
    const salon = SalonLocation[id % SalonLocation.length];

    // when i need to navigate to Booking its down here

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <Image source={salon.Image} style={styles.image} />

            {/* Text content next to image */}
            <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>{salon.name}</Text>

                {/* Address line with icon */}
                <View style={styles.addressRow}>
                    <MaterialIcons name="location-on" size={16} color="#666" style={styles.icon} />
                    <Text style={styles.address} numberOfLines={2}>{salon.address}</Text>
                </View>

                {/* Distance under address but next to image */}
                <Text style={styles.distance}>{salon.distance}</Text>
            </View>

            {/* Se tider button - bottom right */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Se tider</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',           // ← Row layout: image | text | button
        alignItems: 'flex-start',       // ← Align to top
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
        marginRight: 16,                // ← Space between image and text
    },
    textContainer: {
        flex: 1,                        // ← Takes remaining space next to image
        flexDirection: 'column',        // ← Name, address, distance stack vertically
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
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
    address: {
        fontSize: 15,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    distance: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
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
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default SalonCard;
