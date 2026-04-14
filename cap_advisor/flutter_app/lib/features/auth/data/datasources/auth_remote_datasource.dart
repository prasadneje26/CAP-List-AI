import 'package:dio/dio.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/constants/api_constants.dart';

class AuthRemoteDataSource {
  final ApiClient client;

  AuthRemoteDataSource(this.client);

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await client.post(ApiConstants.authLogin, data: {'email': email, 'password': password});
    return response.data['data'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> register(String name, String email, String password, String? phone) async {
    final response = await client.post(ApiConstants.authRegister, data: {'name': name, 'email': email, 'password': password, 'phone': phone});
    return response.data['data'] as Map<String, dynamic>;
  }
}
