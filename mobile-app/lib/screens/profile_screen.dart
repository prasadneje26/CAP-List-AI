// ============================================================
// File: mobile-app/lib/screens/profile_screen.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../main.dart' show AppTheme;

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _user;

  @override
  void initState() {
    super.initState();
    AuthService.getUser().then((u) { if (mounted) setState(() => _user = u); });
  }

  Future<void> _logout() async {
    await AuthService.logout();
    if (mounted) Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Profile')),
    body: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(children: [
        Card(child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(children: [
            CircleAvatar(
              radius: 36, backgroundColor: AppTheme.amber.withOpacity(0.15),
              child: Text(
                (_user?['name'] as String? ?? 'U').substring(0, 1).toUpperCase(),
                style: const TextStyle(fontSize: 28, color: AppTheme.amber, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 14),
            Text(_user?['name'] ?? '—', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(_user?['email'] ?? '—', style: const TextStyle(color: AppTheme.gray2, fontSize: 13)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.amber.withOpacity(0.12),
                borderRadius: BorderRadius.circular(99),
                border: Border.all(color: AppTheme.amber.withOpacity(0.3)),
              ),
              child: Text((_user?['role'] as String? ?? 'student').toUpperCase(),
                style: const TextStyle(fontSize: 11, color: AppTheme.amber, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
            ),
          ]),
        )),
        const SizedBox(height: 12),
        Card(child: Column(children: [
          _Tile(icon: Icons.person_outline, label: 'Edit Academic Profile', onTap: () => Navigator.pushNamed(context, '/input')),
          _Tile(icon: Icons.list_alt_outlined, label: 'View CAP List', onTap: () => Navigator.pushNamed(context, '/results')),
        ])),
        const SizedBox(height: 12),
        ElevatedButton.icon(
          icon: const Icon(Icons.logout, size: 16),
          label: const Text('Logout'),
          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger, foregroundColor: Colors.white),
          onPressed: _logout,
        ),
      ]),
    ),
  );
}

class _Tile extends StatelessWidget {
  final IconData icon;
  final String   label;
  final VoidCallback onTap;
  const _Tile({required this.icon, required this.label, required this.onTap});
  @override
  Widget build(BuildContext context) => ListTile(
    leading: Icon(icon, color: AppTheme.gray2, size: 20),
    title: Text(label, style: const TextStyle(fontSize: 14)),
    trailing: const Icon(Icons.chevron_right, color: AppTheme.gray3, size: 18),
    onTap: onTap,
  );
}
