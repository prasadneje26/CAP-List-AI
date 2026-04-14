import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';
import 'api_constants.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorage _secureStorage = SecureStorage();

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _secureStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    return handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && err.requestOptions.path != ApiConstants.authRefresh) {
      final refreshToken = await _secureStorage.getRefreshToken();
      if (refreshToken != null) {
        try {
          final response = await Dio().post('${ApiConstants.baseUrl}${ApiConstants.authRefresh}', data: {'refreshToken': refreshToken});
          final newAccess = response.data['data']['accessToken'];
          await _secureStorage.saveAccessToken(newAccess);
          final requestOptions = err.requestOptions;
          requestOptions.headers['Authorization'] = 'Bearer $newAccess';
          final retryResponse = await Dio().fetch(requestOptions);
          return handler.resolve(retryResponse);
        } catch (_) {
          await _secureStorage.clearTokens();
        }
      }
    }
    return handler.next(err);
  }
}
