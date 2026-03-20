import { View, TextInput, StyleSheet } from 'react-native'

export default function SearchBar({ onSearch }: { onSearch: (text: string) => void }) {
    return (
        <View style={styles.container}>
            <TextInput style={styles.input}
                placeholder="Søg efter saloner"
                onChangeText={onSearch}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: { width: '100%' },
    input: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    }
})
