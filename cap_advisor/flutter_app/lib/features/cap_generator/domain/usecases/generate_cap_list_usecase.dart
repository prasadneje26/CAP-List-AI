import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../repositories/cap_repository.dart';

class GenerateCAPListUseCase {
  final CapRepository repository;
  GenerateCAPListUseCase(this.repository);

  Future<Either<Failure, Map<String, dynamic>>> execute(Map<String, dynamic> payload) {
    return repository.generateCAPList(payload);
  }
}
