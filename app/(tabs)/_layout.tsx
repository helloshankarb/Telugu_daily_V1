import { Tabs } from 'expo-router';
import { Chrome as Home, BookOpen, ChartBar as BarChart3, User } from 'lucide-react-native';

// Define the icon props type
type TabBarIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2AA8A8',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F8F9FA',
          borderTopColor: '#E1E1E6',
          height: 84,
          paddingTop: 8,
          paddingBottom: 34,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }: TabBarIconProps) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="previous"
        options={{
          title: 'Previous',
          tabBarIcon: ({ size, color }: TabBarIconProps) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }: TabBarIconProps) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }: TabBarIconProps) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}