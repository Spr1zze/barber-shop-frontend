// import { Slot } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';

// export default function RootLayout() {
//   return (
//     <>
//       <StatusBar style="dark" backgroundColor="#ffffff" />
//       <Slot />
//     </>
//   );
// }

// import { Slot, useRouter, useSegments } from "expo-router";
// import { useEffect } from "react";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";

// function ProtectedRoute() {
//   const { isAuthenticated } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     if (!router) return;

//     const inAuthGroup = segments[0] === "(customer)";

//     if (!isAuthenticated && inAuthGroup) {
//       // Redirect to login if not authenticated
//       router.replace("/login");
//     } else if (isAuthenticated && segments[0] === "login") {
//       // Redirect to main app if authenticated and on login page
//       router.replace("/(customer)");
//     }
//   }, [isAuthenticated, segments, router]);

//   return <Slot />;
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <ProtectedRoute />
//     </AuthProvider>
//   );
// }

import { Slot } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
