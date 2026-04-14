import 'package:dio/dio.dart';

class NetworkExceptions implements Exception {
  final String message;

  NetworkExceptions(this.message);

  factory NetworkExceptions.getError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout || error.type == DioExceptionType.receiveTimeout) {
      return NetworkExceptions('Connection timed out. Please try again.');
    }
    if (error.type == DioExceptionType.badResponse) {
      return NetworkExceptions(error.response?.data['error']?.toString() ?? 'Server error occurred.');
    }
    return NetworkExceptions('Network error occurred. Please check your connection.');
  }

  @override
  String toString() => message;
}
