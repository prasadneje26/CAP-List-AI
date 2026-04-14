import '../../../../core/network/api_client.dart';
import '../../../../core/constants/api_constants.dart';

class CapRemoteDataSource {
  final ApiClient client;
  CapRemoteDataSource(this.client);

  Future<Map<String, dynamic>> generateCAPList(Map<String, dynamic> payload) async {
    final response = await client.post(ApiConstants.capGenerate, data: payload);
    return response.data['data'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> fetchHistory() async {
    final response = await client.get(ApiConstants.capHistory);
    return response.data['data'] as Map<String, dynamic>;
  }
}
