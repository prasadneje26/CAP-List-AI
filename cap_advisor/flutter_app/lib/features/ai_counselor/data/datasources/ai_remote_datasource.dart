import '../../../../core/network/api_client.dart';
import '../../../../core/constants/api_constants.dart';

class AIRemoteDataSource {
  final ApiClient client;
  AIRemoteDataSource(this.client);

  Future<String> getStrategy(Map<String, dynamic> payload) async {
    final response = await client.post(ApiConstants.aiStrategy, data: payload);
    return response.data['data']['strategy'] as String;
  }

  Future<String> sendMessage(List<Map<String, dynamic>> messages, Map<String, dynamic>? studentContext) async {
    final response = await client.post(ApiConstants.aiChat, data: {'messages': messages, 'studentContext': studentContext});
    return response.data['data']['reply'] as String;
  }
}
