import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';

abstract class CapRepository {
  Future<Either<Failure, Map<String, dynamic>>> generateCAPList(Map<String, dynamic> payload);
  Future<Either<Failure, List<Map<String, dynamic>>>> getHistory();
}
