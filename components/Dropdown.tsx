import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#2596be';
const SURFACE = '#fbfcfd';
const SURFACE_STRONG = '#f4f9fb';
const TEXT = '#2a2a2a';
const MUTED = '#7b8791';

interface DropdownItem {
  name: string;
  icon?: { lib: 'ion'; name: string; size?: number } | { lib: 'image'; uri: string };
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
}

function ItemIcon({ icon, size = 22, selected = false }: { icon: DropdownItem['icon']; size?: number; selected?: boolean }) {
  if (!icon) return null;

  if (icon.lib === 'image') {
    return (
      <Image
        source={{ uri: icon.uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#e5e5e5',
        }}
      />
    );
  }

  return <Ionicons name={icon.name as any} size={icon.size ?? size} color={selected ? ACCENT : '#8f8b86'} />;
}

export default function Dropdown({ title, items }: DropdownProps) {
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  const openDropdown = () => {
    setIsOpen(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const closeDropdown = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 170,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const toggleDropdown = () => (isOpen ? closeDropdown() : openDropdown());

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const dropdownOpacity = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const displayItem = selectedItem ?? null;
  const displayIcon = displayItem?.icon ?? items[0]?.icon;

  return (
    <View style={[styles.wrapper, isOpen && styles.wrapperOpen]}>
      <TouchableOpacity
        style={[styles.header, isOpen && styles.headerOpen]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <ItemIcon icon={displayIcon} size={32} selected={!!selectedItem} />

          <View style={styles.labelGroup}>
            <Text style={styles.labelTitle}>{title}</Text>
            <Text style={[styles.labelValue, selectedItem && styles.labelValueSelected]} numberOfLines={1}>
              {selectedItem?.name ?? 'Vælg'}
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={16} color={isOpen ? ACCENT : '#a28f81'} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            styles.dropdownOverlay,
            { opacity: dropdownOpacity },
          ]}
        >
          <View style={styles.list}>
            {items.map((item, index) => {
              const isSelected = selectedItem?.name === item.name;
              return (
                <TouchableOpacity
                  key={`${item.name}-${index}`}
                  style={[
                    styles.item,
                    index < items.length - 1 && styles.itemBorder,
                    isSelected && styles.selectedItem,
                  ]}
                  onPress={() => { setSelectedItem(item); closeDropdown(); }}
                  activeOpacity={0.6}
                >
                  <ItemIcon icon={item.icon} size={26} selected={isSelected} />
                  <Text style={[styles.itemText, isSelected && styles.itemTextSelected]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={ACCENT} style={styles.checkmark} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
    position: 'relative',
    zIndex: 1,
  },
  wrapperOpen: {
    zIndex: 99999,
    elevation: 99999,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#dde7ed',
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#f8fbfd',
    borderColor: '#c9dde7',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
    minWidth: 0,
  },
  labelGroup: {
    flex: 1,
    minWidth: 0,
  },
  labelTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  labelValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#97a2aa',
  },
  labelValueSelected: {
    color: TEXT,
    fontWeight: '600',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 100000,
    elevation: 100000,
  },

  list: {
    backgroundColor: SURFACE_STRONG,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#c9dde7',
  },

  item: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37, 150, 190, 0.08)',
  },
  selectedItem: {
    backgroundColor: 'rgba(37, 150, 190, 0.10)',
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: TEXT,
  },
  itemTextSelected: {
    color: ACCENT,
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 4,
  },
});
