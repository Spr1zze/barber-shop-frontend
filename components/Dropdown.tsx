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

const ACCENT = '#18181d';
const SURFACE = '#ffffff';
const SURFACE_STRONG = '#ffffff';
const TEXT = '#1e1d22';
const MUTED = '#8c8691';

interface DropdownItem {
  name: string;
  icon?: { lib: 'ion'; name: string; size?: number } | { lib: 'image'; uri: string };
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
  variant?: 'default' | 'embedded';
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

export default function Dropdown({ title, items, variant = 'default' }: DropdownProps) {
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
  const isEmbedded = variant === 'embedded';

  return (
    <View style={[styles.wrapper, isEmbedded && styles.wrapperEmbedded, isOpen && styles.wrapperOpen]}>
      <TouchableOpacity
        style={[
          styles.header,
          isEmbedded && styles.headerEmbedded,
          isOpen && styles.headerOpen,
          isEmbedded && isOpen && styles.headerEmbeddedOpen,
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <ItemIcon icon={displayIcon} size={isEmbedded ? 28 : 32} selected={!!selectedItem} />

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
            isEmbedded && styles.dropdownOverlayEmbedded,
            { opacity: dropdownOpacity },
          ]}
        >
          <View style={[styles.list, isEmbedded && styles.listEmbedded]}>
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
  wrapperEmbedded: {
    marginBottom: 0,
  },
  wrapperOpen: {
    zIndex: 99999,
    elevation: 99999,
  },
  header: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ece8e2',
  },
  headerOpen: {
    borderColor: '#dbd4cc',
  },
  headerEmbedded: {
    minHeight: 52,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  headerEmbeddedOpen: {
    borderWidth: 0,
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
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    letterSpacing: 0,
    marginBottom: 2,
  },
  labelValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#a8a2ad',
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
  dropdownOverlayEmbedded: {
    top: '100%',
  },

  list: {
    backgroundColor: SURFACE_STRONG,
    marginTop: 8,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ece8e2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  listEmbedded: {
    marginTop: 10,
    borderRadius: 16,
    borderColor: '#e8dfd5',
    shadowOpacity: 0.04,
  },

  item: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1ede8',
  },
  selectedItem: {
    backgroundColor: '#f6f3ef',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
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
