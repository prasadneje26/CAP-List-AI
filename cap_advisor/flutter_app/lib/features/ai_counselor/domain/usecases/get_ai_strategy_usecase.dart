import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../data/datasources/ai_remote_datasource.dart';

class GetAIStrategyUseCase {
  final AIRemoteDataSource remote;
  GetAIStrategyUseCase(this.remote);

  Future<Either<Failure, String>> execute(Map<String, dynamic> payload) async {
    try {
      final response = await remote.getStrategy(payload);
      return Right(response);
    } catch (_) {
      return Left(Failure(message: 'Unable to fetch AI strategy.'));
    }
  }
}
