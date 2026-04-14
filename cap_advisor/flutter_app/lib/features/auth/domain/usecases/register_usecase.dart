import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository repository;
  RegisterUseCase(this.repository);

  Future<Either<Failure, Map<String, dynamic>>> execute(String name, String email, String password, String? phone) {
    return repository.register(name, email, password, phone);
  }
}
