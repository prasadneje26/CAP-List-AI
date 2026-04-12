// ============================================================
// File: mobile-app/lib/services/api_service.dart
// ============================================================

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'token_storage.dart';

class ApiService {
  static const String baseUrl =
      String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:5000/api');

  static Future<Map<String, String>> _headers() async {
    final token = await TokenStorage.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // ── GET ──────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> get(String path) async {
    final res = await http.get(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(),
    );
    return _handle(res);
  }

  // ── POST ─────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final res = await http.post(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(),
      body: jsonEncode(body),
    );
    return _handle(res);
  }

  // ── PUT ──────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> put(String path, Map<String, dynamic> body) async {
    final res = await http.put(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(),
      body: jsonEncode(body),
    );
    return _handle(res);
  }

  // ── Response handler ─────────────────────────────────────────
  static Map<String, dynamic> _handle(http.Response res) {
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    if (res.statusCode >= 200 && res.statusCode < 300) return data;
    throw ApiException(
      data['message'] as String? ?? 'Request failed',
      res.statusCode,
    );
  }
}

class ApiException implements Exception {
  final String message;
  final int    statusCode;
  ApiException(this.message, this.statusCode);
  @override
  String toString() => message;
}
