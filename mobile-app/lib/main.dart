// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: mobile-app/lib/main.dart
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/input_screen.dart';
import 'screens/result_screen.dart';
import 'screens/profile_screen.dart';
import 'services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));
  runApp(const CAPCounselingApp());
}

class CAPCounselingApp extends StatelessWidget {
  const CAPCounselingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CAP AI Counselor',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const AuthGate(),
      routes: {
        '/login':     (_) => const LoginScreen(),
        '/register':  (_) => const RegisterScreen(),
        '/dashboard': (_) => const DashboardScreen(),
        '/input':     (_) => const InputScreen(),
        '/results':   (_) => const ResultScreen(),
        '/profile':   (_) => const ProfileScreen(),
      },
    );
  }
}

// ── Auth gate: decide first screen ───────────────────────────
class AuthGate extends StatefulWidget {
  const AuthGate({super.key});
  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  @override
  void initState() {
    super.initState();
    _check();
  }

  Future<void> _check() async {
    final token = await AuthService.getToken();
    if (!mounted) return;
    Navigator.pushReplacementNamed(
      context,
      token != null ? '/dashboard' : '/login',
    );
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppTheme.navy,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('◈', style: TextStyle(fontSize: 48, color: AppTheme.amber)),
            SizedBox(height: 12),
            Text('CAP AI', style: TextStyle(
              fontFamily: 'Merriweather',
              fontSize: 28,
              color: Colors.white,
              fontWeight: FontWeight.w400,
            )),
          ],
        ),
      ),
    );
  }
}

// ── App Theme ─────────────────────────────────────────────────
class AppTheme {
  static const navy     = Color(0xFF0D1B2A);
  static const navyMid  = Color(0xFF1B2E45);
  static const navyCard = Color(0xFF1E3452);
  static const amber    = Color(0xFFF5A623);
  static const amberDim = Color(0xFFD4841A);
  static const success  = Color(0xFF22C55E);
  static const danger   = Color(0xFFEF4444);
  static const warning  = Color(0xFFF59E0B);
  static const gray1    = Color(0xFFE4E8EF);
  static const gray2    = Color(0xFFA0AAB8);
  static const gray3    = Color(0xFF6B788A);

  static Color classColor(String cls) {
    switch (cls) {
      case 'Dream':  return danger;
      case 'Target': return warning;
      case 'Safe':   return success;
      default:       return gray2;
    }
  }

  static ThemeData get darkTheme => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: navy,
    primaryColor: amber,
    colorScheme: const ColorScheme.dark(
      primary:   amber,
      secondary: amberDim,
      surface:   navyCard,
      error:     danger,
    ),
    fontFamily: 'DMSans',
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontFamily:'Merriweather', color:Colors.white, fontSize:28, fontWeight:FontWeight.w400),
      titleLarge:   TextStyle(color:Colors.white, fontSize:18, fontWeight:FontWeight.w600),
      titleMedium:  TextStyle(color:Colors.white, fontSize:15, fontWeight:FontWeight.w500),
      bodyLarge:    TextStyle(color:Colors.white, fontSize:15),
      bodyMedium:   TextStyle(color:gray2, fontSize:13),
      labelSmall:   TextStyle(color:gray3, fontSize:11, letterSpacing:0.5),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: Colors.white.withOpacity(0.12)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: Colors.white.withOpacity(0.12)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: amber, width: 1.5),
      ),
      labelStyle: const TextStyle(color: gray2, fontSize: 13),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: amber,
        foregroundColor: navy,
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
      ),
    ),
    cardTheme: CardTheme(
      color: navyCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(color: Colors.white.withOpacity(0.07)),
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: navyMid,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(
        fontFamily:'Merriweather', color: Colors.white, fontSize: 18, fontWeight: FontWeight.w400,
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: navyMid,
      selectedItemColor: amber,
      unselectedItemColor: gray3,
      type: BottomNavigationBarType.fixed,
      selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
      unselectedLabelStyle: TextStyle(fontSize: 11),
    ),
  );
}
