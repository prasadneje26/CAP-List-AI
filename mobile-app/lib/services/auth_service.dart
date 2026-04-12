// ============================================================
// File: mobile-app/lib/services/auth_service.dart
// ============================================================

import 'api_service.dart';
import 'token_storage.dart';

class AuthService {
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final res  = await ApiService.post('/auth/login', {'email': email, 'password': password});
    final data = res['data'] as Map<String, dynamic>;
    await TokenStorage.saveToken(data['accessToken'] as String);
    await TokenStorage.saveUser(data['user'] as Map<String, dynamic>);
    return data;
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    final res  = await ApiService.post('/auth/register', {'name': name, 'email': email, 'password': password});
    final data = res['data'] as Map<String, dynamic>;
    await TokenStorage.saveToken(data['accessToken'] as String);
    await TokenStorage.saveUser(data['user'] as Map<String, dynamic>);
    return data;
  }

  static Future<void> logout() async {
    try { await ApiService.post('/auth/logout', {}); } catch (_) {}
    await TokenStorage.clear();
  }

  static Future<String?> getToken()               => TokenStorage.getToken();
  static Future<Map<String, dynamic>?> getUser()  => TokenStorage.getUser();
}
