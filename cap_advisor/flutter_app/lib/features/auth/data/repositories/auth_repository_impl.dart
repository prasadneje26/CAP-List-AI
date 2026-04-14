import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<Either<Failure, Map<String, dynamic>>> login(String email, String password) async {
    try {
      final data = await remoteDataSource.login(email, password);
      return Right(data);
    } catch (_) {
      return Left(Failure(message: 'Unable to login.'));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> register(String name, String email, String password, String? phone) async {
    try {
      final data = await remoteDataSource.register(name, email, password, phone);
      return Right(data);
    } catch (_) {
      return Left(Failure(message: 'Unable to register.'));
    }
  }
}
