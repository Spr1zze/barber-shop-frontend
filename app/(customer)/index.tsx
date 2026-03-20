<<<<<<< HEAD
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import SearchBar from '@/components/SearchBar';
import SalonCard from '@/components/SalonCard';
=======
import { StyleSheet, Text, View } from 'react-native'; import SearchBar from '@/components/SearchBar';
>>>>>>> e74c13629de0f150b663cfd61bf44d1e1fc32e56

export default function SalonList() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Saloner nær dig</Text>
            <SearchBar onSearch={(text) => console.log(text)} />
            <ScrollView>
                <SalonCard id={0} />
                <SalonCard id={1} />
                <SalonCard id={2} />
                <SalonCard id={3} />
                <SalonCard id={3} />
                <SalonCard id={3} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2b2b2b',
        marginBottom: 12,
    },
});
