import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../data/datasources/ai_remote_datasource.dart';

class SendChatMessageUseCase {
  final AIRemoteDataSource remote;
  SendChatMessageUseCase(this.remote);

  Future<Either<Failure, String>> execute(List<Map<String, dynamic>> messages, Map<String, dynamic>? studentContext) async {
    try {
      final response = await remote.sendMessage(messages, studentContext);
      return Right(response);
    } catch (_) {
      return Left(Failure(message: 'Unable to send chat message.'));
    }
  }
}
